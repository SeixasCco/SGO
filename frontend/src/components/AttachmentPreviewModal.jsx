import React from 'react';

const AttachmentPreviewModal = ({ attachmentPath, invoiceNumber, onClose }) => {
    if (!attachmentPath) return null;

    const attachmentUrl = `http://localhost:5145/uploads/${attachmentPath}`;
    const extension = attachmentPath.split('.').pop()?.toLowerCase();
    const fileName = attachmentPath.split('/').pop();

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    const isPdf = extension === 'pdf';
    const isText = ['txt'].includes(extension);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const openInNewTab = () => {
        window.open(attachmentUrl, '_blank');
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-container preview-modal">
                <div className="modal-header">
                    <h3 className="modal-title">
                        📎 Anexo - NF {invoiceNumber}
                    </h3>
                    <div className="page-header-actions">
                        <button onClick={openInNewTab} className="form-button">
                            🔗 Abrir em Nova Aba
                        </button>
                        <button onClick={onClose} className="form-button-secondary">
                            ✕ Fechar
                        </button>
                    </div>
                </div>

                <div className="preview-content">
                    <p className="preview-filename">📄 {fileName}</p>

                    {isImage && (
                        <div className="preview-container">
                            <img
                                src={attachmentUrl}
                                alt={`Anexo da NF ${invoiceNumber}`}
                                className="preview-image"
                            />
                        </div>
                    )}

                    {isPdf && (
                        <div className="preview-container">
                            <iframe
                                src={attachmentUrl}
                                className="preview-iframe"
                                title={`PDF da NF ${invoiceNumber}`}
                            />
                        </div>
                    )}

                    {isText && (
                        <div className="preview-container">
                             <iframe
                                src={attachmentUrl}
                                className="preview-iframe text"
                                title={`Texto da NF ${invoiceNumber}`}
                            />
                        </div>
                    )}
                    
                    {!isImage && !isPdf && !isText && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📁</div>
                            <h3>Prévia não disponível</h3>
                            <p>Tipo de arquivo: {extension?.toUpperCase() || 'Desconhecido'}</p>
                            <button onClick={openInNewTab} className="form-button">
                                🔗 Abrir Arquivo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttachmentPreviewModal;