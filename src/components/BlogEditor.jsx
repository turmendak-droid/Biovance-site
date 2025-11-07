import React, { useState, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function BlogEditor({ editingBlog, onSave }) {
  const [title, setTitle] = useState(editingBlog?.title || "");
  const [author, setAuthor] = useState(editingBlog?.author || "");
  const [content, setContent] = useState(editingBlog?.content || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Update state when editingBlog changes
  React.useEffect(() => {
    setTitle(editingBlog?.title || "");
    setAuthor(editingBlog?.author || "");
    setContent(editingBlog?.content || "");
  }, [editingBlog]);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { data, error } = await supabase.storage
        .from("blog-image")
        .upload(`blog-${Date.now()}.jpg`, file);
      if (error) {
        console.error("Upload failed", error);
        return;
      }
      const publicUrl = supabase.storage
        .from("blog-image")
        .getPublicUrl(data.path).publicUrl;
      insertText(`<img src="${publicUrl}" alt="image" />`);
    }
  };

  const handlePublish = async () => {
    setSaving(true);

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

    setSaving(false);

    if (error) {
      console.error("Error:", error);
      setMessage("⚠️ Failed to save blog");
    } else {
      setMessage(editingBlog ? "✅ Blog updated successfully!" : "✅ Blog published successfully!");
      if (!editingBlog) {
        setTitle("");
        setAuthor("");
        setContent("");
      }
      onSave && onSave();
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
            <label className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
              🖼️ Insert Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

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