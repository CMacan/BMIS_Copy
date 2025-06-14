import React from 'react';
import { usePage, router } from '@inertiajs/react';
import HeaderLayout from "@/Layouts/HeaderLayout";
import Landingbg from "@/Layouts/landingbg";
import ContactInfo from "@/Components/ContactInfo";
import FooterLayout from "@/Layouts/FooterLayout";
import { CalendarIcon, UserIcon } from '@heroicons/react/outline';

const Announcement = () => {
  const { announcements } = usePage().props;

  const handleReadMore = (id) => {
    router.get(`/announcements/${id}`);
  };

  const handleAnnouncementClick = (id) => {
    router.get(`/announcements/${id}`);
  };

  if (!announcements || announcements.length === 0) {
    return (
      <HeaderLayout>
        <Landingbg height="min-h-[40vh]" />
        <div className="container mx-auto px-4 max-w-7xl py-8 text-center">
          <h2 className="text-xl font-bold">No Announcements Available</h2>
          <p className="text-gray-600">Stay tuned for updates and news!</p>
        </div>
        <ContactInfo />
        <FooterLayout />
      </HeaderLayout>
    );
  }

  // Sort announcements by date
  const sortedAnnouncements = announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestAnnouncement = sortedAnnouncements[0];
  const otherAnnouncements = sortedAnnouncements.slice(1);

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(parsedDate);
  };

  return (
    <HeaderLayout>
      <Landingbg height="min-h-[40vh]" />
      <div className="container mx-auto px-4 max-w-7xl py-8" style={{ paddingLeft: '5rem', paddingRight: '5rem' }}>
        <div className="flex flex-col md:flex-row">
          <aside className="md:w-1/4 mb-8 md:mb-0 md:mr-8">
            <h2 className="text-xl font-bold mb-4">Announcements</h2>
            <ul className="space-y-2">
              {sortedAnnouncements.map((announcement, index) => (
                <li key={index}>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    onClick={() => handleAnnouncementClick(announcement.id)}
                  >
                    {announcement.title} - {formatDate(announcement.created_at)}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h4 className="text-xl font-bold mb-4">Latest Announcement</h4>
              <div className="border-b pb-4 last:border-b-0">
                <h2 className="text-lg font-bold mb-2 text-blue-900" onClick={() => handleAnnouncementClick(latestAnnouncement.id)}>
                  {latestAnnouncement.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    Admin
                  </div>
                  <span>|</span>
                  <div>News Updates</div>
                  <span>|</span>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(latestAnnouncement.created_at)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700 leading-relaxed">
                    {latestAnnouncement.content.substring(0, 200)}...
                  </p>
                  <button
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    onClick={() => handleReadMore(latestAnnouncement.id)}
                  >
                    Read more...
                  </button>
                </div>
                {latestAnnouncement.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {latestAnnouncement.tags.split(',').map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-blue-600 text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          <main className="md:w-3/4">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Latest Updates</h1>
              <p className="text-gray-600">Get our latest, event and announcement! #BarangaySawangCalero</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherAnnouncements.map((announcement, index) => (
                <div key={index + 1} id={`announcement-${index + 1}`} className="border-b pb-8 last:border-b-0">
                  <div className="w-full mb-4">
                    <img
                      src={announcement.picture ? `/storage/announcementPictures/${announcement.picture}` : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iOztopzbu3RwmHIzzji09YoBKaT0Mq.png"}
                      alt={announcement.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-blue-900" onClick={() => handleAnnouncementClick(announcement.id)}>
                    {announcement.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Admin
                    </div>
                    <span>|</span>
                    <div>News Updates</div>
                    <span>|</span>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(announcement.created_at)}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-700 leading-relaxed">
                      {announcement.content.substring(0, 200)}...
                    </p>
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      onClick={() => handleReadMore(announcement.id)}
                    >
                      Read more...
                    </button>
                  </div>
                  
                  {/* Tags/Hashtags if any */}
                  {announcement.tags && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {announcement.tags.split(',').map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="text-blue-600 text-sm"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <ContactInfo />
      <FooterLayout />
    </HeaderLayout>
  );
};

export default Announcement;
