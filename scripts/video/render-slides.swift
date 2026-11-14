// Renders 1920x1080 walkthrough slides: an app screenshot in a phone frame
// beside an eyebrow, title and body text in the Saathi fonts and colours.
// Usage: swift render-slides.swift slides.json <fonts-dir> <out-dir>
import AppKit
import CoreText
import Foundation

struct Slide: Decodable {
    let id: String
    let image: String?
    let eyebrow: String
    let title: String
    let body: String
}

let args = CommandLine.arguments
let slides = try JSONDecoder().decode([Slide].self, from: Data(contentsOf: URL(fileURLWithPath: args[1])))
let fontsDir = URL(fileURLWithPath: args[2])
let outDir = URL(fileURLWithPath: args[3])

for name in ["Fraunces_600SemiBold.ttf", "Inter_500Medium.ttf", "Inter_700Bold.ttf"] {
    CTFontManagerRegisterFontsForURL(fontsDir.appendingPathComponent(name) as CFURL, .process, nil)
}

func color(_ hex: Int, _ alpha: CGFloat = 1) -> NSColor {
    NSColor(srgbRed: CGFloat((hex >> 16) & 0xFF) / 255, green: CGFloat((hex >> 8) & 0xFF) / 255, blue: CGFloat(hex & 0xFF) / 255, alpha: alpha)
}

let W: CGFloat = 1920, H: CGFloat = 1080
let sand = color(0xFFF6EA), ink = color(0x2B1B10), inkSoft = color(0x5E4A3B), saffronDeep = color(0xB85410), saffron = color(0xE8761C)

func draw(_ text: String, font: NSFont, color c: NSColor, in rect: CGRect, lineHeight: CGFloat, kern: CGFloat = 0) {
    let style = NSMutableParagraphStyle()
    style.minimumLineHeight = lineHeight
    style.maximumLineHeight = lineHeight
    let attrs: [NSAttributedString.Key: Any] = [.font: font, .foregroundColor: c, .paragraphStyle: style, .kern: kern]
    NSAttributedString(string: text, attributes: attrs).draw(with: rect, options: [.usesLineFragmentOrigin])
}

for s in slides {
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(W), pixelsHigh: Int(H), bitsPerSample: 8, samplesPerPixel: 4,
                               hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    let ctx = NSGraphicsContext(bitmapImageRep: rep)!
    NSGraphicsContext.current = ctx
    // Flip so y grows downward like a page.
    ctx.cgContext.translateBy(x: 0, y: H)
    ctx.cgContext.scaleBy(x: 1, y: -1)
    let flipped = NSGraphicsContext(cgContext: ctx.cgContext, flipped: true)
    NSGraphicsContext.current = flipped

    sand.setFill()
    CGRect(x: 0, y: 0, width: W, height: H).fill()

    // Soft saffron glow behind the phone.
    let glow = NSGradient(colors: [color(0xE8761C, 0.22), color(0xE8761C, 0)])!
    glow.draw(fromCenter: CGPoint(x: 520, y: 540), radius: 0, toCenter: CGPoint(x: 520, y: 540), radius: 620, options: [])

    var textX: CGFloat = 960
    if let path = s.image, let img = NSImage(contentsOfFile: path) {
        let phoneH: CGFloat = 960, phoneW = phoneH * img.size.width / img.size.height
        let frame = CGRect(x: 520 - phoneW / 2 - 14, y: 60 - 14, width: phoneW + 28, height: phoneH + 28)
        color(0x1B1B1D).setFill()
        NSBezierPath(roundedRect: frame, xRadius: 70, yRadius: 70).fill()
        let screen = CGRect(x: 520 - phoneW / 2, y: 60, width: phoneW, height: phoneH)
        NSGraphicsContext.saveGraphicsState()
        NSBezierPath(roundedRect: screen, xRadius: 58, yRadius: 58).addClip()
        img.draw(in: screen, from: .zero, operation: .sourceOver, fraction: 1, respectFlipped: true, hints: nil)
        NSGraphicsContext.restoreGraphicsState()
    } else {
        textX = 220
    }

    let textW = W - textX - 160
    saffron.setFill()
    CGRect(x: textX, y: 300, width: 72, height: 6).fill()
    draw(s.eyebrow.uppercased(), font: NSFont(name: "Inter-Bold", size: 26) ?? .boldSystemFont(ofSize: 26), color: saffronDeep,
         in: CGRect(x: textX, y: 330, width: textW, height: 60), lineHeight: 34, kern: 4)
    draw(s.title, font: NSFont(name: "Fraunces-SemiBold", size: 76) ?? .systemFont(ofSize: 76), color: ink,
         in: CGRect(x: textX, y: 390, width: textW, height: 260), lineHeight: 88)
    draw(s.body, font: NSFont(name: "Inter-Medium", size: 34) ?? .systemFont(ofSize: 34), color: inkSoft,
         in: CGRect(x: textX, y: 600, width: textW, height: 400), lineHeight: 50)

    draw("Saathi · ISKCON Coimbatore", font: NSFont(name: "Inter-Bold", size: 22) ?? .boldSystemFont(ofSize: 22), color: color(0x8C7A6B),
         in: CGRect(x: W - 520, y: H - 70, width: 440, height: 40), lineHeight: 28, kern: 1)

    NSGraphicsContext.restoreGraphicsState()
    let png = rep.representation(using: .png, properties: [:])!
    try png.write(to: outDir.appendingPathComponent("\(s.id).png"))
    print("rendered \(s.id)")
}
