import React from 'react';
import { usePage } from '@inertiajs/react';
import HeaderLayout from "@/Layouts/HeaderLayout";
import ContactInfo from "@/Components/ContactInfo";
import FooterLayout from "@/Layouts/FooterLayout";
import { CalendarIcon, UserIcon } from '@heroicons/react/outline';

const DetailAnnouncement = () => {
  const { announcement } = usePage().props;

  // Format date
  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(parsedDate);
  };

  return (
    <HeaderLayout>
      <div className="container mx-auto px-4 max-w-7xl py-8" style={{ paddingLeft: '5rem', paddingRight: '5rem' }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">{announcement.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>Admin</span>
            </div>
            <span>|</span>
            <div>News Updates</div>
            <span>|</span>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(announcement.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="w-full mb-6">
          <img
            src={announcement.picture ? `/storage/announcementPictures/${announcement.picture}` : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iOztopzbu3RwmHIzzji09YoBKaT0Mq.png"}
            alt={announcement.title}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
          {announcement.content}
        </div>

        {/* Tags/Hashtags if any */}
        {announcement.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {announcement.tags.split(',').map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded-full"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Ruler */}
        <hr className="my-8 border-t-2 border-gray-300" />
      </div>

      {/* Contact Info Section */}
      <ContactInfo />

      {/* Footer */}
      <FooterLayout />
    </HeaderLayout>
  );
};

export default DetailAnnouncement;