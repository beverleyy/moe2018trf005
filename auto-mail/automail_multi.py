# AUTOMATED EMAIL LOOP
# Author: Beverley Yeo, NTU Singapore

# LIBRARIES
import email, smtplib, ssl, time

# Use text file as template
from string import Template

# Setup the email format
from email import encoders
from email.utils import formatdate
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# Function to read comma-delimited .txt file
def user_emails(filename):
    names = []
    emails = []
    fclasses = []
    ftimes = []
    flinks = []
    with open(filename, mode='r', encoding='utf-8') as contacts_file:
        for a_contact in contacts_file:
            the_person = a_contact.split(",")
            names.append(the_person[0])
            emails.append(the_person[1])
            fclasses.append(the_person[2])
            ftimes.append(the_person[3])
            flinks.append((the_person[4]).rstrip("\n"))
    return names, emails, fclasses, ftimes, flinks

# Function to read the CC line text file (comma-delimited email-name pairs)
def cc_read(filename):
    cc_names = []
    cc_emails = []
    cc_class = []
    cc_time = []
    cc_links = []
    with open(filename,mode="r",encoding="utf-8") as address_file:
        for c_contact in address_file:
            the_cc = c_contact.split(",")
            cc_emails.append(the_cc[0])
            cc_names.append((the_cc[1]).rstrip("\n"))
            cc_class.append("Placeholder")
            cc_time.append("Placeholder")
            cc_links.append("Placeholder")
    cc_str = ", ".join(cc_emails)
    return cc_names, cc_emails, cc_class, cc_time, cc_links, cc_str

# Function to generate template from text file and replace blanks
def generate_message(filename):
    with open(filename, 'r', encoding='utf-8') as template_file:
        template_file_content = template_file.read()
    return Template(template_file_content)

# MAIN PROGRAM
def main():
    
    # Setup Email
    subject = input("Email subject: ")
    sender_email = input("Sender email address: ")
    sender_name = input("Sender's name: ")
    sender = sender_name+" <"+sender_email+">"

    address_book = input("Contacts file: ")
    cc_list = input("CC list file: ")
    msg_temp = input("Message template file: ")
    filename = input("Attachment: ")  # In same directory as script

    # Read contacts from file
    names, emails, fclasses, ftimes, flinks = user_emails(address_book)
    
    if (len(cc_list)):
        cc_dir, cc_emails, cc_class, cc_time, cc_links, cc_str = cc_read(cc_list) #read cc list
        names += cc_dir
        emails += cc_emails
        fclasses += cc_class
        ftimes += cc_time
        flinks += cc_links
    
    # Setup Templates
    text_template = generate_message(msg_temp)

    # Password...
    password = input("Password: ")
    
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
    smtp_h = input("SMTP server: ")
    smtp_p = input("SMTP port number: ")
    smtp_pn = int(smtp_p)

    # Email server    
    #with smtplib.SMTP_SSL(smtp_h, smtp_pn, context=context) as server:
    with smtplib.SMTP(smtp_h,smtp_pn) as server:
        server.login(sender_email, password)
        
        # Loop thru all name-email pairs imported
        for name, receiver_email, fc, ft, fl in zip(names, emails, fclasses, ftimes, flinks):

            if (len(cc_list) and receiver_email in cc_emails):
                receiver = "#NULL"
                name = "#NULL"
                fc = "CLASS_HERE"
                ft = "TIME_HERE"
                fl = "PLACEHOLDER_LINK"
            else:
                name = name.upper()
                user = receiver_email.split("@")[0].upper()
                dom = "@"+receiver_email.split("@")[1]
                receiver = "#"+name+"# <"+(user+dom)+">"
            
            # Setup multipart message (allow both plaintext and html)
            message = MIMEMultipart()
            message["From"] = sender
            message["To"] = receiver
            
            if len(cc_list):
                message["CC"] = cc_str
                
            message["Subject"] = subject
            message["Date"] = formatdate(localtime=True)

            # Change html to text for plaintext
            text = text_template.substitute(PERSON_NAME=name.title(),CLASS=fc,FGD_TIME=ft,FGD_URL=fl)

            # Convert to plain/html MIMEText
            # Change html to text for plaintext
            part2 = MIMEText(text, "html")

            # Add message parts to MIMEMultipart message
            message.attach(part2)

            # Attach file with name = filename
            if len(filename): # If attachment input given

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
            
            time.sleep(1) #for testing with mailtrap 
            
        #end for loop
    #end with loop
#end main
        
if __name__ == '__main__':
    main()    
    print('Completed')
