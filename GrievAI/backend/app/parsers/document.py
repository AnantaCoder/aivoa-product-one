import io
import email
from email import policy
import docx
from pypdf import PdfReader

def parse_txt(content: bytes) -> str:
    try:
        return content.decode("utf-8")
    except UnicodeDecodeError:
        return content.decode("latin-1", errors="replace")

def parse_pdf(content: bytes) -> str:
    try:
        reader = PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text
    except Exception as e:
        raise ValueError(f"Could not read PDF: {str(e)}")

def parse_docx(content: bytes) -> str:
    doc = docx.Document(io.BytesIO(content))
    return "\n".join([para.text for para in doc.paragraphs])

def parse_eml(content: bytes) -> str:
    msg = email.message_from_bytes(content, policy=policy.default)
    text_content = ""
    
    # Extract headers
    subject = msg.get("subject", "")
    sender = msg.get("from", "")
    date = msg.get("date", "")
    
    text_content += f"Subject: {subject}\n"
    text_content += f"From: {sender}\n"
    text_content += f"Date: {date}\n\n"
    
    #extract body 
    body = msg.get_body(preferencelist=('plain', 'html'))
    if body:
        text_content += body.get_content()
    else:
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                text_content += part.get_payload(decode=True).decode(part.get_content_charset() or 'utf-8', errors="replace")
                break
    return text_content

def parse_document(filename: str, content: bytes) -> str:
    filename_lower = filename.lower()
    if filename_lower.endswith(".pdf"):
        return parse_pdf(content)
    elif filename_lower.endswith(".docx"):
        return parse_docx(content)
    elif filename_lower.endswith(".eml"):
        return parse_eml(content)
    else:
        # Default fallback is treating it as a text file
        return parse_txt(content)

# local testing 
if __name__ == "__main__":
    document = "Aivoa internship opportunity.pdf"
    with open(document, "rb") as file:
        content = file.read()
        parsed_text = parse_pdf(content)
        print(parsed_text.strip())
        print(len(parsed_text))
        