import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { useToast } from '@/Contexts/ToastContext';

export default function CreateAnnouncementPage({ auth }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [picture, setPicture] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const showToast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('is_published', isPublished ? "1" : "0");
    if (picture) {
      formData.append('picture', picture);
    }

    router.post('/admin/announcements', formData, {
      onSuccess: () => {
        showToast('Successfully saved announcement!', 'success');
        // Reset form fields
        setTitle('');
        setContent('');
        setIsPublished(false);
        setPicture(null);
        setIsProcessing(false);
      },
      onError: (errors) => {
        console.error('Error creating announcement:', errors);
        showToast('Failed to create announcement. Please try again.', 'error');
        setIsProcessing(false);
      },
    });
  };

  return (
    <>
      <Head title="Create Announcement" />
        <div className="w-full max-w-6xl bg-white p-16 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter announcement title"
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="8"
                className="w-full px-6 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter announcement content"
                required
              ></textarea>
            </div>
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Upload Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPicture(e.target.files[0])}
                className="w-full"
              />
            </div>
            <div className="mb-8 flex items-center">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="mr-3"
              />
              <span className="text-lg text-gray-700">Publish Immediately</span>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className={`px-8 py-4 rounded-md text-white ${
                  isProcessing ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isProcessing ? 'Creating Announcement...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>

    </>
  );
}
