package rdw.reporting.web.servlet.view;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.View;
import rdw.reporting.web.servlet.view.support.ContentExposingResponseWrapper;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.Map;

/**
 * This class wraps a View and converts the HTML it produces into a PDF
 * This is done by rendering the wrapped view with a ContentExposingResponseWrapper.
 * The ContentExposingResponseWrapper captures the HTML document written to the http response in a temporary byte array.
 * This byte array is then processed by the iText library into a PDF for download.
 */
public class ITextHtmlToPdfView implements View {

	private static final String DEFAULT_CHARACTER_ENCODING = "UTF-8";
	private View view;
	private String characterEncoding;

	public ITextHtmlToPdfView(View view, String characterEncoding) {
		this.view = view;
		this.characterEncoding = characterEncoding != null ? characterEncoding : DEFAULT_CHARACTER_ENCODING;
	}

	@Override
	public String getContentType() {
		return MediaType.APPLICATION_PDF_VALUE;
	}

	@Override
	public void render(Map<String, ?> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
		final byte[] html = renderHtml(view, model, request, response);
		final ByteArrayOutputStream outputStream = renderPdf(html, response);
		writeToResponse(response, outputStream);
	}

	private byte[] renderHtml(View view, Map<String, ?> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
		final ContentExposingResponseWrapper responseWrapper = new ContentExposingResponseWrapper(response);
		view.render(model, request, responseWrapper);
		return responseWrapper.getContent().getBytes(characterEncoding);
	}

	private ByteArrayOutputStream renderPdf(byte[] html, HttpServletResponse response) throws DocumentException, IOException {
		final ByteArrayOutputStream outputStream = new ByteArrayOutputStream(4096);
		final Document document = new Document();
		final PdfWriter pdfWriter = PdfWriter.getInstance(document, outputStream);
		document.open();
		final InputStream inputStream = new ByteArrayInputStream(html);
		final XMLWorkerHelper xmlWorkerHelper = XMLWorkerHelper.getInstance();
		xmlWorkerHelper.parseXHtml(pdfWriter, document, inputStream, Charset.forName(characterEncoding));
		document.close();
		return outputStream;
	}

	/*
		Modeled after AbstractView.writeToResponse() and AbstractView.prepareResponse()
	 */
	private void writeToResponse(HttpServletResponse response, ByteArrayOutputStream outputStream) throws IOException {
		response.setHeader("Pragma", "private");
		response.setHeader("Cache-Control", "private, must-revalidate");
		response.setContentType(getContentType());
		response.setContentLength(outputStream.size());
		final ServletOutputStream servletOutputStream = response.getOutputStream();
		outputStream.writeTo(servletOutputStream);
		servletOutputStream.flush();
	}

}