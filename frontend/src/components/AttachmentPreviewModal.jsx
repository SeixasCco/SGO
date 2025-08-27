import React from 'react';

const AttachmentPreviewModal = ({ attachmentPath, invoiceNumber, onClose }) => {
    if (!attachmentPath) return null;

    const attachmentUrl = `http://localhost:5145/api/contractinvoices/attachment/${attachmentPath}`;
    const extension = attachmentPath.split('.').pop()?.toLowerCase();
    const fileName = attachmentPath.split('/').pop();

    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
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
        <div style={overlayStyle} onClick={handleBackdropClick}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h3 style={titleStyle}>
                        📎 Anexo - NF {invoiceNumber}
                    </h3>
                    <div style={actionsHeaderStyle}>
                        <button onClick={openInNewTab} style={buttonStyle.primary}>
                            🔗 Abrir em Nova Aba
                        </button>
                        <button onClick={onClose} style={buttonStyle.secondary}>
                            ✕ Fechar
                        </button>
                    </div>
                </div>

                <div style={contentStyle}>
                    <p style={fileNameStyle}>📄 {fileName}</p>

                    {isImage && (
                        <div style={previewContainerStyle}>
                            <img
                                src={attachmentUrl}
                                alt={`Anexo da NF ${invoiceNumber}`}
                                style={imageStyle}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div style={{ ...errorMessageStyle, display: 'none' }}>
                                ❌ Erro ao carregar imagem
                            </div>
                        </div>
                    )}

                    {isPdf && (
                        <div style={previewContainerStyle}>
                            <iframe
                                src={attachmentUrl}
                                style={iframeStyle}
                                title={`PDF da NF ${invoiceNumber}`}
                            />
                        </div>
                    )}

                    {isText && (
                        <div style={previewContainerStyle}>
                            <iframe
                                src={attachmentUrl}
                                style={textIframeStyle}
                                title={`Texto da NF ${invoiceNumber}`}
                            />
                        </div>
                    )}

                    {!isImage && !isPdf && !isText && (
                        <div style={noPreviewStyle}>
                            <div style={noPreviewIconStyle}>📁</div>
                            <p>Prévia não disponível para este tipo de arquivo</p>
                            <p style={subtextStyle}>
                                Tipo: {extension?.toUpperCase() || 'Desconhecido'}
                            </p>
                            <button onClick={openInNewTab} style={buttonStyle.primary}>
                                🔗 Abrir Arquivo
                            </button>
                        </div>
                    )}
                </div>
            </div>
       </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000
};

const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
};

const headerStyle = {
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const titleStyle = {
    margin: 0,
    color: '#1e293b',
    fontSize: '1.2rem',
    fontWeight: '600'
};

const actionsHeaderStyle = {
    display: 'flex',
    gap: '12px'
};

const contentStyle = {
    padding: '24px',
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
};

const fileNameStyle = {
    margin: '0 0 16px 0',
    padding: '8px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    fontSize: '0.9rem',
    color: '#475569'
};

const previewContainerStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px'
};

const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
};

const iframeStyle = {
    width: '100%',
    height: '500px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px'
};

const textIframeStyle = {
    ...iframeStyle,
    height: '400px'
};

const noPreviewStyle = {
    textAlign: 'center',
    padding: '40px',
    color: '#64748b'
};

const noPreviewIconStyle = {
    fontSize: '3rem',
    marginBottom: '16px'
};

const subtextStyle = {
    fontSize: '0.9rem',
    color: '#94a3b8',
    marginBottom: '20px'
};

const errorMessageStyle = {
    textAlign: 'center',
    color: '#dc2626',
    padding: '20px'
};

const buttonStyle = {
    primary: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    },
    secondary: {
        backgroundColor: '#f1f5f9',
        color: '#475569',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    }
};

export default AttachmentPreviewModal;
