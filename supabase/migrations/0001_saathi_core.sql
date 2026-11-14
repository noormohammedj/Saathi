-- Saathi core schema (Supabase / Postgres 15+)
-- Public profile data and private contact data live in separate tables so
-- row-level security can hide mobile/email from everyone except temple admins.

create extension if not exists "pgcrypto";
create extension if not exists "postgis";

-- ── Temples (multi-centre from day one: Coimbatore first, then expand) ──────
create table temple (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,              -- 'coimbatore'
  name          text not null,
  address       text,
  location      geography(point, 4326) not null,   -- geofence centre
  geofence_m    int  not null default 150,
  created_at    timestamptz not null default now()
);

-- ── Members ─────────────────────────────────────────────────────────────────
create type member_role as enum ('devotee', 'coordinator', 'admin');

create table member (
  id              uuid primary key references auth.users on delete cascade,
  temple_id       uuid not null references temple,
  display_name    text not null,
  initiated_name  text,
  since_year      int  check (since_year between 1966 and extract(year from now())::int),
  headline        text,
  bio             text,
  area            text,
  languages       text[] not null default '{}',
  availability    text[] not null default '{}',
  photo_path      text,
  verified        boolean not null default false,
  role            member_role not null default 'devotee',
  created_at      timestamptz not null default now()
);

-- Admin-only. Never selected by the devotee app.
create table member_private (
  member_id   uuid primary key references member on delete cascade,
  mobile      text not null,
  email       text not null,
  updated_at  timestamptz not null default now()
);

create table skill (
  id     text primary key,            -- 'yoga', 'music', 'tech', ...
  label  text not null
);

create table member_skill (
  member_id  uuid references member on delete cascade,
  skill_id   text references skill,
  level      smallint default 2,     -- 1 learning · 2 capable · 3 can lead
  primary key (member_id, skill_id)
);

-- ── Circles (micro-communities) ─────────────────────────────────────────────
create table circle (
  id           uuid primary key default gen_random_uuid(),
  temple_id    uuid not null references temple,
  name         text not null,
  tagline      text,
  skill_id     text references skill,
  lead_id      uuid references member,
  open_to_all  boolean not null default true,
  meets        text
);
create table circle_member (
  circle_id  uuid references circle on delete cascade,
  member_id  uuid references member on delete cascade,
  status     text not null default 'active' check (status in ('requested','active')),
  primary key (circle_id, member_id)
);

-- ── Events & seva roles ─────────────────────────────────────────────────────
create table event (
  id              uuid primary key default gen_random_uuid(),
  temple_id       uuid not null references temple,
  title           text not null,
  subtitle        text,
  kind            text not null check (kind in ('festival','weekly','seva','outreach')),
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  venue           text,
  attend_credits  int not null default 20
);
create table event_role (
  id        uuid primary key default gen_random_uuid(),
  event_id  uuid not null references event on delete cascade,
  title     text not null,
  skill_id  text references skill,
  needed    int not null,
  credits   int not null
);
create table role_signup (
  role_id      uuid references event_role on delete cascade,
  member_id    uuid references member on delete cascade,
  status       text not null default 'signed' check (status in ('signed','confirmed','completed','no_show')),
  verified_by  uuid references member,     -- coordinator who confirmed the shift
  primary key (role_id, member_id)
);

-- ── Connections (swipe) & chat ──────────────────────────────────────────────
create table connection (
  from_id    uuid references member on delete cascade,
  to_id      uuid references member on delete cascade,
  kind       text not null check (kind in ('connect','later','invite')),
  event_id   uuid references event,
  created_at timestamptz not null default now(),
  primary key (from_id, to_id)
);
-- A match = two 'connect'/'invite' rows in opposite directions (see view below).

create table thread (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('direct','team','circle')),
  title       text,
  event_id    uuid references event,
  circle_id   uuid references circle,
  created_at  timestamptz not null default now()
);
create table thread_member (
  thread_id  uuid references thread on delete cascade,
  member_id  uuid references member on delete cascade,
  primary key (thread_id, member_id)
);
create table message (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references thread on delete cascade,
  sender_id   uuid references member,
  kind        text not null default 'text' check (kind in ('text','seva-invite','system')),
  body        text not null,
  event_id    uuid references event,
  flagged     boolean not null default false,  -- moderation (contact-sharing, abuse)
  created_at  timestamptz not null default now()
);

-- ── Sadhana & credits (append-only ledger) ──────────────────────────────────
create table sadhana_log (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references member on delete cascade,
  day         date not null default current_date,
  kind        text not null check (kind in ('japa','gita','lecture','visit','program')),
  amount      int  not null,             -- rounds, chapters, minutes, 1
  evidence    jsonb,                     -- {lat,lng,accuracy} or {qr_nonce} for visits
  created_at  timestamptz not null default now()
);

create table credit_rule (
  id         text primary key,           -- 'visit', 'japa', 'seva', ...
  temple_id  uuid references temple,
  points     int not null,
  daily_cap  int
);

create table credit_ledger (
  id          bigserial primary key,
  member_id   uuid not null references member on delete cascade,
  points      int not null,              -- negative for redemptions
  reason      text not null,
  source      text not null,             -- 'sadhana_log:<id>', 'role_signup:<id>', 'redemption:<id>'
  created_at  timestamptz not null default now(),
  unique (source)                        -- idempotent: one award per source event
);

create view member_balance as
  select member_id, coalesce(sum(points), 0)::int as credits
  from credit_ledger group by member_id;

create table reward (
  id          text primary key,
  temple_id   uuid references temple,
  name        text not null,
  cost        int not null,
  category    text not null,
  stock       int
);
create table redemption (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references member,
  reward_id   text not null references reward,
  code        text unique not null,
  status      text not null default 'ready' check (status in ('ready','collected','cancelled')),
  created_at  timestamptz not null default now()
);

create table donation (
  id           uuid primary key default gen_random_uuid(),
  member_id    uuid references member,
  fund         text not null,             -- 'annadaan','kovai-chandra','gau-seva',...
  tier_label   text,
  amount_inr   int not null,
  gateway_ref  text unique,               -- set by payment webhook only
  status       text not null default 'pending',
  created_at   timestamptz not null default now()
);

-- ── Row-level security ──────────────────────────────────────────────────────
create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (select 1 from member where id = auth.uid() and role = 'admin')
$$;

alter table member          enable row level security;
alter table member_private  enable row level security;
alter table message         enable row level security;
alter table credit_ledger   enable row level security;
alter table sadhana_log     enable row level security;

-- Public profile: any signed-in devotee may read.
create policy member_read   on member for select using (auth.role() = 'authenticated');
create policy member_update on member for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from member where id = auth.uid()));

-- Private contact: ONLY admins can read; owners can update their own.
create policy private_admin_read on member_private for select using (is_admin());
create policy private_owner_upsert on member_private for insert with check (member_id = auth.uid());
create policy private_owner_update on member_private for update using (member_id = auth.uid());

-- Messages: only thread members.
create policy message_read on message for select using (
  exists (select 1 from thread_member tm where tm.thread_id = message.thread_id and tm.member_id = auth.uid())
);
create policy message_send on message for insert with check (
  sender_id = auth.uid() and
  exists (select 1 from thread_member tm where tm.thread_id = message.thread_id and tm.member_id = auth.uid())
);

-- Ledger & sadhana: read own; writes only via Edge Functions (service role).
create policy ledger_read_own  on credit_ledger for select using (member_id = auth.uid() or is_admin());
create policy sadhana_read_own on sadhana_log   for select using (member_id = auth.uid() or is_admin());
