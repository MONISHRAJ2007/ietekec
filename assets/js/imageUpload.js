/**
 * IETE Student Forum – KEC
 * Image Upload Component
 * 
 * Provides drag-and-drop + click-to-select image upload
 * with client-side preview, compression, and Supabase Storage upload.
 * No URL input fields — fully file-based workflow.
 */

import { uploadImage } from './supabase-client.js';
import { showToast } from './animations.js';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * Compress an image file using Canvas API
 * @param {File} file
 * @param {number} maxWidth  - max output width in px
 * @param {number} quality   - JPEG quality 0-1
 * @returns {Promise<Blob>}
 */
export async function compressImage(file, maxWidth = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject(new Error('Compression failed'));
      }, 'image/jpeg', quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Initialize a single-image upload zone
 * 
 * @param {object} options
 * @param {string}   options.zoneId       - ID of the .admin-upload-zone or .upload-zone element
 * @param {string}   options.previewId    - ID of container to show preview image
 * @param {string}   options.bucket       - Supabase bucket name
 * @param {string}   options.folder       - path prefix within the bucket (e.g. 'team/')
 * @param {Function} options.onUpload     - callback(publicUrl) called after successful upload
 * @param {Function} [options.onRemove]   - callback() called when image is removed
 * @param {string}   [options.existingUrl]- pre-existing image URL to show in preview
 */
export function initSingleUpload({ zoneId, previewId, bucket, folder, onUpload, onRemove, existingUrl }) {
  const zone = document.getElementById(zoneId);
  const previewContainer = document.getElementById(previewId);
  if (!zone || !previewContainer) return;

  let currentFile = null;
  let uploadedUrl = existingUrl || null;

  // Show existing image if provided
  if (existingUrl) {
    showPreview(existingUrl);
  }

  // ── Drag & Drop ──
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  // ── Click to select ──
  const input = zone.querySelector('input[type="file"]');
  if (input) {
    input.addEventListener('change', () => {
      if (input.files[0]) handleFile(input.files[0]);
    });
  }

  async function handleFile(file) {
    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      showToast('Only JPG, PNG, and WEBP images are allowed.', 'error');
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      showToast(`Image must be smaller than ${MAX_SIZE_MB}MB.`, 'error');
      return;
    }
    currentFile = file;
    // Show immediate preview
    const objectUrl = URL.createObjectURL(file);
    showPreview(objectUrl, true);
  }

  function showPreview(src, isLocal = false) {
    zone.style.display = 'none';
    previewContainer.innerHTML = `
      <div class="img-preview-card">
        <img src="${src}" alt="Preview" id="${previewId}-img" />
        <div class="img-preview-card__overlay">
          <button type="button" class="btn btn--sm btn--secondary" id="${previewId}-change-btn">
            Change
          </button>
          <button type="button" class="btn btn--sm btn--danger" id="${previewId}-remove-btn">
            Remove
          </button>
        </div>
      </div>
      ${isLocal ? `<div class="upload-progress-area" id="${previewId}-progress" style="margin-top:0.5rem;display:none;">
        <div class="progress-bar"><div class="progress-bar__fill" id="${previewId}-bar" style="width:0%"></div></div>
        <p style="font-size:var(--text-xs);color:var(--color-text-muted);margin-top:4px" id="${previewId}-status">Ready to upload on save</p>
      </div>` : ''}
    `;
    previewContainer.style.display = 'block';

    document.getElementById(`${previewId}-change-btn`)?.addEventListener('click', () => resetUpload());
    document.getElementById(`${previewId}-remove-btn`)?.addEventListener('click', () => {
      resetUpload();
      uploadedUrl = null;
      if (onRemove) onRemove();
    });
  }

  function resetUpload() {
    currentFile = null;
    previewContainer.innerHTML = '';
    previewContainer.style.display = 'none';
    zone.style.display = '';
    if (input) input.value = '';
  }

  /**
   * Call this when the form is submitted to actually upload the file
   * @returns {Promise<string|null>} - public URL of uploaded file, or existing URL, or null
   */
  async function performUpload() {
    if (!currentFile) return uploadedUrl; // No new file selected — return existing URL

    const progressArea = document.getElementById(`${previewId}-progress`);
    const progressBar = document.getElementById(`${previewId}-bar`);
    const statusText = document.getElementById(`${previewId}-status`);

    if (progressArea) progressArea.style.display = 'block';
    if (statusText) statusText.textContent = 'Compressing image...';
    if (progressBar) progressBar.style.width = '20%';

    try {
      const compressed = await compressImage(currentFile);
      if (progressBar) progressBar.style.width = '50%';
      if (statusText) statusText.textContent = 'Uploading...';

      const ext = 'jpg'; // compressed to JPEG
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = folder ? `${folder.replace(/\/$/, '')}/${fileName}` : fileName;

      const publicUrl = await uploadImage(bucket, path, new File([compressed], fileName, { type: 'image/jpeg' }));

      if (progressBar) progressBar.style.width = '100%';
      if (statusText) statusText.textContent = '✓ Uploaded successfully';

      uploadedUrl = publicUrl;
      if (onUpload) onUpload(publicUrl);
      currentFile = null;
      return publicUrl;
    } catch (err) {
      if (statusText) statusText.textContent = '✕ Upload failed — ' + err.message;
      showToast('Image upload failed. Please try again.', 'error');
      return null;
    }
  }

  return { performUpload, getUrl: () => uploadedUrl };
}

/**
 * Initialize bulk image upload (for gallery)
 * 
 * @param {object} options
 * @param {string}   options.zoneId     - upload zone element ID
 * @param {string}   options.gridId     - preview grid element ID  
 * @param {string}   options.bucket     - Supabase bucket name
 * @param {string}   options.folder     - path prefix within bucket
 * @param {Function} options.onComplete - callback(urls[]) called when all uploads done
 */
export function initBulkUpload({ zoneId, gridId, bucket, folder, onComplete }) {
  const zone = document.getElementById(zoneId);
  const grid = document.getElementById(gridId);
  if (!zone || !grid) return;

  const fileQueue = new Map(); // filename → { file, url }

  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    addFiles(Array.from(e.dataTransfer.files));
  });

  const input = zone.querySelector('input[type="file"]');
  if (input) {
    input.addEventListener('change', () => addFiles(Array.from(input.files)));
  }

  function addFiles(files) {
    const valid = files.filter(f => f.type.match(/image\/(jpeg|jpg|png|webp)/i) && f.size <= MAX_SIZE_BYTES);
    if (valid.length < files.length) showToast('Some files were skipped (wrong type or >5MB)', 'warning');
    valid.forEach(file => {
      const key = `${file.name}-${file.lastModified}`;
      if (!fileQueue.has(key)) {
        fileQueue.set(key, { file, url: null });
        renderItem(key, file);
      }
    });
    if (input) input.value = '';
  }

  function renderItem(key, file) {
    const objectUrl = URL.createObjectURL(file);
    const item = document.createElement('div');
    item.className = 'bulk-item';
    item.id = `bulk-item-${key.replace(/[^a-z0-9]/gi, '_')}`;
    item.innerHTML = `
      <img src="${objectUrl}" alt="${file.name}" />
      <div class="bulk-item__progress">
        <div class="bulk-item__progress-fill" id="fill-${key.replace(/[^a-z0-9]/gi, '_')}" style="width:0%"></div>
      </div>
      <button type="button" class="bulk-item__remove" title="Remove" data-key="${key}">×</button>
    `;
    item.querySelector('.bulk-item__remove').addEventListener('click', () => {
      fileQueue.delete(key);
      item.remove();
      URL.revokeObjectURL(objectUrl);
    });
    grid.appendChild(item);
  }

  /**
   * Upload all queued files
   * @returns {Promise<string[]>} - array of public URLs
   */
  async function uploadAll() {
    const urls = [];
    for (const [key, entry] of fileQueue.entries()) {
      if (entry.url) { urls.push(entry.url); continue; } // already uploaded
      const fillId = `fill-${key.replace(/[^a-z0-9]/gi, '_')}`;
      const fill = document.getElementById(fillId);
      if (fill) fill.style.width = '30%';
      try {
        const compressed = await compressImage(entry.file);
        if (fill) fill.style.width = '60%';
        const ext = 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const path = folder ? `${folder.replace(/\/$/, '')}/${fileName}` : fileName;
        const url = await uploadImage(bucket, path, new File([compressed], fileName, { type: 'image/jpeg' }));
        if (fill) fill.style.width = '100%';
        if (url) {
          entry.url = url;
          urls.push(url);
        }
      } catch (err) {
        if (fill) fill.style.background = 'var(--color-danger)';
        console.error('Failed to upload', entry.file.name, err);
      }
    }
    if (onComplete) onComplete(urls);
    return urls;
  }

  return { uploadAll, getCount: () => fileQueue.size };
}
