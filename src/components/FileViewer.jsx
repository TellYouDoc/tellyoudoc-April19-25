import { useState, useEffect, useRef } from 'react';
import '../styles/FileViewer.css';
import { FaTimes, FaArrowLeft, FaArrowRight, FaDownload, FaSpinner, FaSearchPlus, FaSearchMinus, FaExpand } from 'react-icons/fa';
import { MdZoomOutMap } from 'react-icons/md';

const FileViewer = ({ file, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const pdfRef = useRef(null);
  const navigatorRef = useRef(null);

  // Get the file extension
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };
  useEffect(() => {
    if (!file) return;

    // Set the URL based on the file object
    let fileUrl = file.url || (typeof file === 'string' ? file : null);
    
    if (!fileUrl) {
      setError('No valid URL found for this file');
      setIsLoading(false);
      return;
    }

    // For Cloudinary URLs, modify parameters for better viewing experience
    if (fileUrl.includes('cloudinary.com')) {
      // For PDFs, use the Cloudinary PDF viewer with optimized settings
      if (file.name?.toLowerCase().endsWith('.pdf') || fileUrl.toLowerCase().includes('.pdf')) {
        // Remove or replace fl_attachment parameter to view in browser instead of downloading
        fileUrl = fileUrl.replace('fl_attachment', 'fl_attachment:false');
      }
    }

    setUrl(fileUrl);
    setIsLoading(false);
  }, [file]);

  const handleDownload = () => {
    if (!url) return;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle PDF specific events  // Handle PDF specific events
  const handlePdfLoad = (event) => {
    const iframe = event.target;
    try {
      // Get the PDF document from iframe
      const iframeWindow = iframe.contentWindow;
      
      // Wait for PDF.js to initialize
      setTimeout(() => {
        if (iframeWindow && iframeWindow.PDFViewerApplication) {
          const pdfViewer = iframeWindow.PDFViewerApplication;
          pdfViewer.initializedPromise.then(() => {
            setTotalPages(pdfViewer.pagesCount);
            
            // Add page change listener
            pdfViewer.eventBus.on('pagechanging', (evt) => {
              setCurrentPage(evt.pageNumber);
            });
          });
        }
      }, 1000);
    } catch (e) {
      console.error('Error accessing PDF viewer:', e);
    }
  };

  const zoomIn = () => {
    if (zoomLevel < 200) {
      setZoomLevel(zoomLevel + 25);
    }
  };
  const zoomOut = () => {
    if (zoomLevel > 50) {
      setZoomLevel(zoomLevel - 25);
    }
  };

  const resetZoom = () => {
    setZoomLevel(100);
    setViewPosition({ x: 0, y: 0 });
    if (containerRef.current) {
      containerRef.current.scrollLeft = 0;
      containerRef.current.scrollTop = 0;
    }
  };
  // Handle navigator drag start
  const handleNavigatorDragStart = (e) => {
    if (!navigatorRef.current) return;
    
    setIsDragging(true);
    const rect = navigatorRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragStart({ x: offsetX, y: offsetY });
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
  };
  // Handle navigator drag move
  const handleNavigatorDragMove = (e) => {
    if (!isDragging || !navigatorRef.current || !containerRef.current) return;
    
    const navigatorRect = navigatorRef.current.getBoundingClientRect();
    
    // Calculate position within the navigator (as percentage)
    // Subtract dragStart to account for where in the view box the user clicked
    const clickX = e.clientX - navigatorRect.left;
    const clickY = e.clientY - navigatorRect.top;
    
    // Convert to percentage
    const percentX = clickX / navigatorRect.width;
    const percentY = clickY / navigatorRect.height;
    
    // Apply constraints (keep between 0 and 1)
    const constrainedX = Math.max(0, Math.min(1, percentX));
    const constrainedY = Math.max(0, Math.min(1, percentY));
    
    // Update the view position
    setViewPosition({ x: constrainedX, y: constrainedY });
    
    // Apply scrolling to the container - adjust based on the container's dimensions
    if (containerRef.current) {
      const maxScrollX = containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const maxScrollY = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      
      containerRef.current.scrollLeft = maxScrollX * constrainedX;
      containerRef.current.scrollTop = maxScrollY * constrainedY;
    }
    
    // Prevent default behavior
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle navigator drag end
  const handleNavigatorDragEnd = () => {
    setIsDragging(false);
  };

  // Add global mouse move and up listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleNavigatorDragMove(e);
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        handleNavigatorDragEnd();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="file-loading">
          <FaSpinner className="spinner" />
          <p>Loading file...</p>
        </div>
      );
    }

    if (error) {
      return <div className="file-error">{error}</div>;
    }

    const extension = getFileExtension(file.name || url);

    switch (extension) {      // Images
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return (
          <div ref={containerRef} className="image-container">
            <div className="image-wrapper" style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.3s ease' }}>
              <img 
                ref={imageRef}
                src={url} 
                alt={file.name || "Document"} 
                onLoad={() => setIsLoading(false)}
                onError={() => setError('Failed to load image')}
              />
            </div>
            
            {/* Mini Navigator */}
            {zoomLevel > 100 && (
              <div className="mini-navigator">
                <div 
                  ref={navigatorRef} 
                  className="mini-navigator-content"
                  onMouseDown={handleNavigatorDragStart}
                >
                  <img 
                    src={url} 
                    alt="Navigator" 
                  />
                  <div 
                    className="view-box"
                    style={{
                      width: `${(containerRef.current?.clientWidth / (containerRef.current?.scrollWidth || 1)) * 100}%`,
                      height: `${(containerRef.current?.clientHeight / (containerRef.current?.scrollHeight || 1)) * 100}%`,
                      left: `${viewPosition.x * 100}%`,
                      top: `${viewPosition.y * 100}%`
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
        // PDFs
      case 'pdf':
        return (
          <div className="pdf-container">
            <iframe 
              src={`${url}#toolbar=1&navpanes=1&view=FitH`}
              title={file.name || "PDF Document"}
              frameBorder="0"
              width="100%"
              height="100%"
              onLoad={handlePdfLoad}
              onError={() => setError('Failed to load PDF')}
            />
          </div>
        );
      
      // For other file types that can't be displayed directly
      default:
        return (
          <div className="unsupported-file">
            <p>This file type ({extension}) cannot be previewed directly.</p>
            <button className="download-button" onClick={handleDownload}>
              <FaDownload /> Download File
            </button>
          </div>
        );
    }
  };

  return (
    <div className="file-viewer-overlay">
      <div className="file-viewer-container">
        <div className="file-viewer-header">
          <div className="file-info">
            <h3>{file.name || "Document"}</h3>
            {totalPages > 1 && (
              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </div>          <div className="viewer-controls">
            {/* Zoom controls */}
            <button className="control-button" onClick={zoomOut} title="Zoom Out">
              <FaSearchMinus />
            </button>
            <span className="zoom-level">{zoomLevel}%</span>
            <button className="control-button" onClick={zoomIn} title="Zoom In">
              <FaSearchPlus />
            </button>
            <button className="control-button" onClick={resetZoom} title="Reset Zoom">
              <MdZoomOutMap />
            </button>
            
            {/* Navigation controls - only show if multiple pages */}
            {totalPages > 1 && (
              <>
                <button 
                  className="control-button"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  title="Previous Page"
                >
                  <FaArrowLeft />
                </button>
                <button 
                  className="control-button"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  title="Next Page"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
            
            {/* Download button */}
            <button className="control-button" onClick={handleDownload} title="Download File">
              <FaDownload />
            </button>
            
            {/* Close button */}
            <button className="close-button" onClick={onClose} title="Close">
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="file-viewer-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
