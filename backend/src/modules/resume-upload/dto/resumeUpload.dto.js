class ResumeUploadDTO {
  static response(upload) {
    if (!upload) return null;

    return {
      id: upload._id,

      originalName: upload.originalName,
      fileName: upload.fileName,
      fileUrl: upload.fileUrl,

      fileType: upload.fileType,
      fileSize: upload.fileSize,

      parsingStatus: upload.parsingStatus,

      extractedText: upload.extractedText,

      metadata: upload.metadata,

      resume: upload.resume
        ? {
            id: upload.resume._id,
            title: upload.resume.title,
            status: upload.resume.status,
          }
        : null,

      createdAt: upload.createdAt,
      updatedAt: upload.updatedAt,
    };
  }

  static responseList(uploads) {
    return uploads.map((upload) => this.response(upload));
  }
}

module.exports = ResumeUploadDTO;