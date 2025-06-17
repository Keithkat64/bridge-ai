import PyPDF2
import re
import os

def extract_pdf_text(pdf_path):
    print(f"Opening PDF file: {pdf_path}")
    
    with open(pdf_path, 'rb') as file:
        # Create PDF reader object
        pdf_reader = PyPDF2.PdfReader(file)
        print(f"PDF loaded. Number of pages: {len(pdf_reader.pages)}")
        
        # Extract text from all pages
        text = ""
        for i, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            text += page_text
            print(f"Page {i+1} extracted: {len(page_text)} characters")
        
        print(f"\nTotal text extracted: {len(text)} characters")
        return text

# Usage
if __name__ == "__main__":
    pdf_path = input("Enter the path to your PDF file: ")
    
    if not os.path.exists(pdf_path):
        print(f"Error: File not found at {pdf_path}")
        input("Press Enter to exit...")
        exit()
    
    try:
        # Extract text
        text = extract_pdf_text(pdf_path)
        
        # Save raw text to file
        raw_text_file = "raw_pdf_text.txt"
        with open(raw_text_file, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"\nRaw text saved to {raw_text_file}")
        
        # Print a sample of the text
        print("\nSample of extracted text:")
        print("-" * 50)
        print(text[:500] + "..." if len(text) > 500 else text)
        print("-" * 50)
        
        # Look for potential hand markers
        hand_markers = re.findall(r'Hand\s*\d+|Do you bid', text)
        print(f"\nPotential hand markers found: {len(hand_markers)}")
        if hand_markers:
            print("First few markers:", hand_markers[:5])
        
        # Look for position markers
        position_markers = re.findall(r'North:|South:|East:|West:', text)
        print(f"Position markers found: {len(position_markers)}")
        if position_markers:
            print("First few position markers:", position_markers[:5])
        
    except Exception as e:
        print(f"Error: {str(e)}")
    
    input("\nPress Enter to exit...")
