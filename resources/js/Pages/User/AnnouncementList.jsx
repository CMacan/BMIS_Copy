import { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import { Calendar, ChevronLeft, ChevronRight, Bell, MessageCircle, Share2, Eye } from 'lucide-react';

function AnnouncementCard({ announcement }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    // Add animation when component mounts
    setIsVisible(true);
  }, []);

  // Format date as Month DD, YYYY
  const formattedDate = new Date(announcement.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const content = announcement.content;
  // Show first 150 characters by default
  const truncatedContent = content.length > 150 ? content.substring(0, 150) + "..." : content;

  // Generate a random pastel background color for announcements without images
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 90%)`;
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {announcement.picture ? (
        <div className="relative">
          <img
            src={`/storage/announcementPictures/${announcement.picture}`}
            alt={announcement.title}
            className="w-full h-52 sm:h-48 object-cover"
          />
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Bell className="w-3 h-3 mr-1" />
            <span>Announcement</span>
          </div>
        </div>
      ) : (
        <div 
          className="w-full h-40 flex items-center justify-center relative"
          style={{ backgroundColor: getRandomPastelColor() }}
        >
          <Bell className="w-16 h-16 text-white opacity-30" />
          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Bell className="w-3 h-3 mr-1" />
            <span>Announcement</span>
          </div>
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{announcement.title}</h3>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        <p className="text-gray-700 text-sm leading-relaxed">
          {isExpanded ? content : truncatedContent}
        </p>
        
        {content.length > 150 && (
          <button 
            onClick={toggleExpand} 
            className="mt-3 text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors flex items-center"
          >
            {isExpanded ? "Show Less" : "Read More"}
            <Eye className="w-4 h-4 ml-1" />
          </button>
        )}
        
        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <div className="flex space-x-3">
            <button className="text-gray-500 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-blue-600 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {announcement.category || "General"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementList({ auth, announcement }) {
  const { totalEntries } = usePage().props;
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading for pagination
  const handlePageChange = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <UserLayout
      user={auth.user}
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Announcement
        </h2>
      }
    >
      <Head title="List of Announcements" />
      <div className="p-4 sm:p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-blue-600" />
            Barangay Announcements
          </h1>
          <div className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">
            {totalEntries} Total
          </div>
        </div>
        
        {announcement.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Announcements Yet</h3>
            <p className="text-gray-500 max-w-md">
              There are currently no announcements from the barangay. Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcement.map((ann, index) => (
              <AnnouncementCard key={ann.id || index} announcement={ann} />
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 gap-4">
          <div className="text-sm text-gray-500">
            Showing {announcement.length} out of {totalEntries}
          </div>
          <div className="flex gap-2 self-center sm:self-auto">
            <button 
              className="px-3 py-1 border rounded-md text-gray-600 bg-white flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePageChange}
              disabled={true}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button 
              className="px-3 py-1 border rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={handlePageChange}
            >
              1
            </button>
            <button 
              className="px-3 py-1 border rounded-md text-gray-600 bg-white hover:bg-gray-100 flex items-center"
              onClick={handlePageChange}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
