import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Create transporter (you might want to use environment variables for credentials)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_PASS || 'your-app-password'
      }
    });

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-left: 4px solid #667eea;">
          <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>
          </table>
          
          <h3 style="color: #333; margin-top: 30px;">Message:</h3>
          <div style="background: white; padding: 20px; border-radius: 5px; border-left: 3px solid #667eea;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>This message was sent from the PlacementHub contact form on ${new Date().toLocaleString()}.</p>
          </div>
        </div>
      </div>
    `;

    // Mail options
    const mailOptions = {
      from: email,
      to: 'medhajha810@gmail.com',
      subject: `PlacementHub Contact: ${subject}`,
      html: htmlContent,
      replyTo: email
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to the user
    const autoReplyOptions = {
      from: 'medhajha810@gmail.com',
      to: email,
      subject: 'Thank you for contacting PlacementHub',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">Thank You for Contacting Us!</h2>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px;">
            <h3 style="color: #333;">Hi ${name},</h3>
            <p style="color: #666; line-height: 1.6;">
              Thank you for reaching out to PlacementHub! We have received your message and will get back to you as soon as possible.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 5px; border-left: 3px solid #667eea; margin: 20px 0;">
              <h4 style="color: #333; margin-top: 0;">Your Message Summary:</h4>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Our team typically responds within 24-48 hours. If your inquiry is urgent, please don't hesitate to contact us directly.
            </p>
            
            <p style="color: #666;">
              Best regards,<br>
              The PlacementHub Team
            </p>
          </div>
        </div>
      `
    };

    // Send auto-reply (don't await to avoid blocking the response)
    transporter.sendMail(autoReplyOptions).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! We'll get back to you soon."
    });

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to send message. Please try again later." 
      },
      { status: 500 }
    );
  }
}