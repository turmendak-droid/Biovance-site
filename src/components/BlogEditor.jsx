import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function BlogEditor({ editingBlog, onSave }) {
  const [title, setTitle] = useState(editingBlog?.title || "");
  const [author, setAuthor] = useState(editingBlog?.author || "");
  const [content, setContent] = useState(editingBlog?.content || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const textareaRef = useRef(null);

  // Update state when editingBlog changes
  React.useEffect(() => {
    setTitle(editingBlog?.title || "");
    setAuthor(editingBlog?.author || "");
    setContent(editingBlog?.content || "");
  }, [editingBlog]);

  // Load gallery images
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('test-bucket')
          .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (error) {
          console.error('Error loading gallery images:', error);
          return;
        }

        const imagesWithUrls = data.map(file => ({
          name: file.name,
          url: supabase.storage.from('test-bucket').getPublicUrl(file.name).data.publicUrl,
          size: file.metadata?.size || 0,
          created_at: file.created_at
        }));

        setGalleryImages(imagesWithUrls);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      }
    };

    loadGalleryImages();

    // Refresh gallery images when component becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadGalleryImages();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const insertText = (before, after = "") => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = before + selectedText + after;
    const newContent = content.substring(0, start) + newText + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertImageFromGallery = (imageUrl, imageName) => {
    insertText(`<img src="${imageUrl}" alt="${imageName}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;" />`);
    setShowImageSelector(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type);

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size too large. Please choose an image under 5MB.");
        return;
      }

      try {
        // Create a clean filename
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `blog-${Date.now()}-${cleanFileName}`;

        console.log("Attempting upload to bucket: test-bucket");
        const { data, error } = await supabase.storage
          .from("test-bucket")
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (error) {
          console.error("Upload failed:", error);
          console.error("Full error details:", {
            message: error.message,
            statusCode: error.statusCode,
            hint: error.hint,
            details: error.details,
            code: error.code
          });

          // Detect permission/policy issues
          if (error.statusCode === 403 || error.message?.includes('permission') || error.message?.includes('policy')) {
            console.error('🔒 PERMISSION BLOCK DETECTED!')
            console.error('💡 FIX: Create this RLS policy in Supabase SQL Editor:')
            console.error(`
CREATE POLICY "Allow authenticated uploads to test-bucket" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'test-bucket');
            `)
          }

          alert("Image upload failed: " + error.message + "\n\nCheck:\n1. 'test-bucket' bucket exists in Supabase Storage\n2. You have upload permissions\n3. You're logged in as admin");
          return;
        }

        console.log("Upload successful:", data);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("test-bucket")
          .getPublicUrl(data.path);

        if (!urlData?.publicUrl) {
          console.error("Failed to get public URL");
          alert("Upload succeeded but failed to get image URL");
          return;
        }

        console.log("Public URL generated:", urlData.publicUrl);

        // Refresh gallery images to include the new upload
        const loadGalleryImages = async () => {
          try {
            const { data: galleryData, error: galleryError } = await supabase.storage
              .from('test-bucket')
              .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

            if (!galleryError) {
              const imagesWithUrls = galleryData.map(file => ({
                name: file.name,
                url: supabase.storage.from('test-bucket').getPublicUrl(file.name).data.publicUrl,
                size: file.metadata?.size || 0,
                created_at: file.created_at
              }));
              setGalleryImages(imagesWithUrls);
            }
          } catch (error) {
            console.error('Error refreshing gallery images:', error);
          }
        };

        loadGalleryImages();

        // Test if URL is accessible
        try {
          const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
          if (!response.ok) {
            console.warn("URL may not be accessible yet:", response.status);
          }
        } catch (urlTestError) {
          console.warn("Could not verify URL accessibility:", urlTestError);
        }

        insertText(`<img src="${urlData.publicUrl}" alt="${file.name}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; display: block;" />`);
        alert("Image uploaded successfully! URL: " + urlData.publicUrl);
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Unexpected error during upload: " + err.message + "\n\nCheck:\n1. Supabase connection\n2. Storage bucket permissions\n3. Network connectivity");
      }
    }
  };

  const handlePublish = async () => {
    setSaving(true);

    try {
      let error;
      if (editingBlog) {
        ({ error } = await supabase.from("blogs").update({
          title,
          author,
          content,
        }).eq('id', editingBlog.id));
      } else {
        ({ error } = await supabase.from("blogs").insert({
          title,
          author,
          content,
          published: true,
          created_at: new Date(),
        }));
      }

      if (error) {
        console.error("Error saving blog:", error);
        setMessage("⚠️ Failed to save blog: " + error.message);
      } else {
        console.log("Blog saved successfully:", { title, author, content: content.substring(0, 100) + "..." });
        setMessage(editingBlog ? "✅ Blog updated successfully!" : "✅ Blog published successfully!");
        if (!editingBlog) {
          setTitle("");
          setAuthor("");
          setContent("");
        }
        onSave && onSave();
      }
    } catch (err) {
      console.error("Unexpected error saving blog:", err);
      setMessage("⚠️ Unexpected error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-2xl border border-green-100 mt-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full blur-2xl opacity-30"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-green-900 mb-2 flex items-center">
          <span className="mr-3">🧬</span>
          {editingBlog ? "Edit Blog Post" : "Create New Blog"}
        </h2>
        <p className="text-green-700 mb-8 font-medium">Craft your story with rich formatting and embedded images</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2">Blog Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="w-full border-2 border-green-200 p-4 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2">Author Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="w-full border-2 border-green-200 p-4 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-green-800 mb-3">Formatting Toolbar</label>
          <div className="flex flex-wrap gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <button
              onClick={() => insertText("<h1>", "</h1>")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              📰 H1 Heading
            </button>
            <button
              onClick={() => insertText("<h2>", "</h2>")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              📄 H2 Subheading
            </button>
            <button
              onClick={() => insertText("<p>", "</p>")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              📝 Paragraph
            </button>
            <button
              onClick={() => setShowImageSelector(!showImageSelector)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              🖼️ Insert Image
            </button>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
              📤 Upload New
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Image Selector Modal */}
        {showImageSelector && (
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Select Image from Gallery</h3>
              <button
                onClick={() => setShowImageSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => insertImageFromGallery(image.url, image.name)}
                  className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:border-green-400 transition-colors"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-2 text-xs text-gray-600 truncate">
                    {image.name}
                  </div>
                </div>
              ))}
            </div>
            {galleryImages.length === 0 && (
              <p className="text-center text-gray-500 py-8">No images in gallery yet. Upload some images first!</p>
            )}
          </div>
        )}

        <div className="mb-8">
          <label className="block text-sm font-semibold text-green-800 mb-3">Blog Content</label>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your amazing blog post... Use the toolbar above to format text and add images!"
            rows={12}
            className="w-full border-2 border-green-200 p-6 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all shadow-sm resize-vertical min-h-[300px] bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {editingBlog && (
            <button
              onClick={() => onSave && onSave()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold"
            >
              ❌ Cancel Edit
            </button>
          )}
          <button
            onClick={handlePublish}
            disabled={saving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {editingBlog ? "Updating..." : "Publishing..."}
              </span>
            ) : (
              <span className="flex items-center">
                🚀 {editingBlog ? "Update Blog" : "Publish Blog"}
              </span>
            )}
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-xl border-2 ${
            message.includes("✅")
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}