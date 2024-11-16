from pdf2docx import Converter
import sys

def convert_pdf_to_docx(pdf_file, docx_file):
    # Initialize the converter
    cv = Converter(pdf_file)
    
    # Convert the PDF file to DOCX (entire file)
    cv.convert(docx_file, start=0, end=None)
    
    # Close the converter
    cv.close()
    print(f"Conversion complete: {docx_file}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: convert.py input_pdf output_docx")
    else:
        input_pdf = sys.argv[1]
        output_docx = sys.argv[2]
        convert_pdf_to_docx(input_pdf, output_docx)







# import sys
# import fitz
# from docx import Document 

# def convert_pdf_to_docx(pdf_file, docx_file):
#   doc = Document()
#   pdf_document = fitz.open(pdf_file)


#   for page_num in range(len(pdf_document)): 
#     page = pdf_document[page_num]
#     text = page.get_text("text")
#     doc.add_paragraph(text)

#   doc.save(docx_file )
#   print(f"Conversion complete: {docx_file}")

# if __name__ == " __main__":
#   if len(sys.argv) != 3:
#     print("Usage: convert.py input_pdf output_docx")
# else:
#   input_pdf = sys.argv[1]
#   output_docx = sys.argv[2]

#   convert_pdf_to_docx(input_pdf,output_docx)
#   print("conversion complete")






# # File: pdf_to_word_converter.py

# import sys
# from pdf2docx import Converter

# # Input and output file paths passed from the Node.js backend
# input_pdf = sys.argv[1]
# output_docx = sys.argv[2]

# # Perform the conversion
# cv = Converter(input_pdf)
# cv.convert(output_docx, start=0, end=None)  # Convert the entire PDF to DOCX
# cv.close()

# # Print success message
# print(f"Conversion successful: {output_docx}")
