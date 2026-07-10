/**
 * Loads an image from a URL and returns an HTMLImageElement.
 * @param {string} url
 * @returns {Promise<HTMLImageElement>}
 */
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
    });
}

/**
 * Generates a PDF document for a car listing.
 * @param {Object} listing - The car listing data.
 * @param {Object} seller - The seller's profile data.
 * @param {string[]} images - Array of image URLs.
 * @returns {Promise<Blob>} The generated PDF as a Blob.
 */
export async function generateListingPdf(listing, seller, images) {
    const { jsPDF } = window.jspdf;
    
    // Create a new A4 PDF document
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Primary color
    doc.text('AutoMarket', 20, currentY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Gray
    doc.setFont('helvetica', 'normal');
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Generated on: ${dateStr}`, pageWidth - 20, currentY, { align: 'right' });
    
    currentY += 15;

    // --- Listing Title & Price ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // Dark
    
    const titleLines = doc.splitTextToSize(listing.title, pageWidth - 40);
    doc.text(titleLines, 20, currentY);
    currentY += (titleLines.length * 8) + 2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139);
    doc.text(`${listing.brand} · ${listing.model} · ${listing.year}`, 20, currentY);
    
    currentY += 10;
    
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(listing.price);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text(formattedPrice, 20, currentY);
    
    currentY += 15;

    // --- Cover Image ---
    if (images && images.length > 0) {
        try {
            const img = await loadImage(images[0]);
            // Calculate image dimensions to fit within width (pageWidth - 40)
            const maxWidth = pageWidth - 40;
            const ratio = img.height / img.width;
            const imgHeight = maxWidth * ratio;
            
            // Draw image (url, format, x, y, width, height)
            doc.addImage(img, 'JPEG', 20, currentY, maxWidth, imgHeight);
            currentY += imgHeight + 15;
        } catch (err) {
            console.warn('Failed to load image for PDF', err);
            doc.setFontSize(10);
            doc.text('[Image unavailable]', 20, currentY);
            currentY += 10;
        }
    }

    // --- Specifications ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Specifications', 20, currentY);
    currentY += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    
    const specs = [
        `Year: ${listing.year}`,
        `Mileage: ${listing.mileage ? listing.mileage.toLocaleString() + ' km' : 'N/A'}`,
        `Fuel Type: ${listing.fuel_type || 'N/A'}`,
        `Transmission: ${listing.transmission || 'N/A'}`,
        `Engine: ${listing.engine || 'N/A'}`,
        `Horsepower: ${listing.horsepower ? listing.horsepower + ' HP' : 'N/A'}`,
        `Color: ${listing.color || 'N/A'}`,
        `Location: ${listing.location || 'N/A'}`
    ];

    // Draw specs in two columns
    const col1X = 20;
    const col2X = pageWidth / 2 + 10;
    let specY = currentY;

    for (let i = 0; i < specs.length; i++) {
        const text = specs[i];
        if (i % 2 === 0) {
            doc.text(text, col1X, specY);
        } else {
            doc.text(text, col2X, specY);
            specY += 7;
        }
    }
    
    currentY = specY + 15;

    // --- Description ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Description', 20, currentY);
    currentY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    
    const descText = listing.description || 'No description provided.';
    const descLines = doc.splitTextToSize(descText, pageWidth - 40);
    
    // Check if description fits on the current page
    if (currentY + (descLines.length * 5) > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        currentY = 20;
    }
    
    doc.text(descLines, 20, currentY);
    currentY += (descLines.length * 5) + 15;

    // --- Seller Info ---
    // Check page space
    if (currentY + 30 > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Seller Information', 20, currentY);
    currentY += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    
    const sellerName = seller?.full_name || seller?.username || 'Unknown Seller';
    doc.text(`Name: ${sellerName}`, 20, currentY);
    currentY += 7;
    doc.text(`Phone: ${seller?.phone || 'Not provided'}`, 20, currentY);
    currentY += 7;
    doc.text(`Email: ${seller?.email || 'Not provided'}`, 20, currentY);
    
    // Return the generated PDF as a Blob
    return doc.output('blob');
}
