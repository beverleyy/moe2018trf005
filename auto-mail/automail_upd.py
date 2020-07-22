# AUTOMATED EMAIL LOOP
# Author: Beverley Yeo, NTU Singapore

# LIBRARIES
import email, smtplib, ssl

# Use text file as template
from string import Template

# Setup the email format
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Function to read comma-delimited name-email pairs
def user_emails(filename):
    names = []
    emails = []
    with open(filename, mode='r', encoding='utf-8') as contacts_file:
        for a_contact in contacts_file:
            names.append(a_contact.split(",")[0])
            emails.append((a_contact.split(",")[1]).rstrip("\n"))
    return names, emails

# Function to read the CC line text file
def cc_read(filename):
    cc_names = []
    cc_emails = []
    cc_line = []
    with open(filename,mode="r",encoding="utf-8") as address_file:
        for c_contact in address_file:
            cc_names.append(c_contact.split("<")[0])
            cc_emails.append((c_contact.split("<")[1]).split(">")[0])
            cc_line.append(c_contact.rstrip("\n"))
    cc_str = ", ".join(cc_line)
    return cc_names, cc_emails, cc_str

# Function to generate template from text file and replace blanks
def generate_message(filename):
    with open(filename, 'r', encoding='utf-8') as template_file:
        template_file_content = template_file.read()
    return Template(template_file_content)

# MAIN PROGRAM
def main():
    
    # Setup Email
    subject = input("Email subject:")
    sender_email = input("Sender email address:")
    sender_name = input("Sender's name:")
    sender = sender_name+" <"+sender_email+">"

    address_book = input("Contacts file:")
    cc_list = input("CC list file:")
    msg_temp = input("Message template file:")

    names, emails = user_emails(address_book) #read contacts from file
    cc_dir, cc_emails, cc_str = cc_read(cc_list) #read cc list

    names += cc_dir
    emails += cc_emails
    
    # Setup Templates
    html_template = generate_message(msg_temp)

    # Password...
    password = input("Type your password and press enter:")
    
    # IMPORTANT NOTE ABOUT GMAIL SECURITY
    # When the program is run without the right security settings,
    # it will return as error (especially Gmail).
    # Therefore, it is important to either...
    #   1. Go to Google security settings and turn on "Less secure app access"
    #   2. Set up OAuth or OAuth2 (complicated).
    # DO NOT RUN THE PROGRAM WITHOUT THE CORRECT SECURITY!

    # Log in to server using secure context and send email
    context = ssl.create_default_context()

    # Get server details
    smtp_h = input("SMTP server:")
    smtp_p = input("SMTP port number:")
    smtp_pn = int(smtp_p)

    # Email server    
    with smtplib.SMTP(smtp_h, smtp_pn) as server:
        server.login(sender_email, password)
        
        # Loop thru all name-email pairs imported
        for name, receiver_email in zip(names, emails):

            if receiver_email not in cc_emails:
                name = name.upper()
                user = receiver_email.split("@")[0].upper()
                dom = "@"+receiver_email.split("@")[1]
                receiver = "#"+name+"# <"+(user+dom)+">"
            else:
                receiver = "#NULL"
                name = "#NULL"
            
            # Setup multipart message (allow both plaintext and html)
            message = MIMEMultipart()
            message["From"] = sender
            message["To"] = receiver
            message["CC"] = cc_str
            message["Subject"] = subject

            # Change html to text for plaintext
            html = html_template.substitute(PERSON_NAME=name.title())

            # Convert to plain/html MIMEText
            # Change html to text for plaintext
            part2 = MIMEText(html, "html")

            # Add message parts to MIMEMultipart message
            message.attach(part2)

            # Attach file with name = filename
            filename = input("Attachment:")  # In same directory as script

            if len(filename)==0: # If attachment input given

                # Open PDF file in binary mode
                with open(filename, "rb") as attachment:
                    # Add file as application/octet-stream
                    # Email client can usually download this automatically as attachment
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(attachment.read())

                # Encode file in ASCII characters to send by email    
                encoders.encode_base64(part)

                # Add header as key/value pair to attachment part
                part.add_header(
                    "Content-Disposition",
                    f"attachment; filename= {filename}",
                )

                # Add attachment to message and convert message to string
                message.attach(part)

            # Send the email
            server.sendmail(
                sender_email, receiver_email, message.as_string()
            )

            # Clear the message object for the next iteration
            del message
            
        #end for loop
    #end with loop
#end main
        
if __name__ == '__main__':
    main()    
    print('Completed')
