"use client"
import { Award, Users, BookOpen, Briefcase, Heart, Lightbulb, Plus } from "lucide-react"

export default function ERPATSpecificFields({ data, handleInputChange, errors }) {
  return (
    <div className="space-y-6">
      {/* Special Abilities Section */}
      <div className="bg-gradient-to-br from-white to-purple-50 p-5 rounded-lg shadow-md border border-purple-100 transition-all hover:shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-sm">
            <Award className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Special Abilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100 transition-all group-hover:shadow-md group-hover:border-purple-200">
              <div className={errors.erpa_skillsTalent ? "border-l-2 border-red-500 pl-3" : ""}>
                <label
                  htmlFor="skillsTalent"
                  className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_skillsTalent ? "text-red-600" : "text-gray-700"} mb-1.5`}
                > 
                  <div className="p-1 bg-purple-100 rounded-md">
                    <Lightbulb className="h-3 w-3 text-purple-600" />
                  </div>
                  Skills/Talent
                </label>
                <input
                  type="text"
                  id="skillsTalent"
                  name="erpa_skillsTalent"
                  placeholder="e.g., Cooking, Carpentry, Public Speaking"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_skillsTalent?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-purple-100 focus:border-purple-400  focus:ring-purple-100"} transition-colors`}
                  value={data.erpa_skillsTalent}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100 transition-all group-hover:shadow-md group-hover:border-purple-200">
              <div className={errors.erpa_hobbies ? "border-l-2 border-red-500 pl-3" : ""}>
                <label htmlFor="hobbies" className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_hobbies ? "text-red-600" : "text-gray-700"} mb-1.5`}>
                  <div className="p-1 bg-purple-100 rounded-md">
                    <Heart className="h-3 w-3 text-purple-600" />
                  </div>
                  Hobbies
                </label>
                <input
                  type="text"
                  id="hobbies"
                  name="erpa_hobbies"
                  placeholder="e.g., Gardening, Reading, Sports"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_hobbies?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-purple-100 focus:border-purple-400  focus:ring-purple-100"} transition-colors`}
                  value={data.erpa_hobbies}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100 transition-all group-hover:shadow-md group-hover:border-purple-200">
              <div className={errors.erpa_otherSkills ? "border-l-2 border-red-500 pl-3" : ""}>
                <label htmlFor="otherSkills" className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_otherSkills ? "text-red-600" : "text-gray-700"} mb-1.5`}>
                  <div className="p-1 bg-purple-100 rounded-md">
                    <Plus className="h-3 w-3 text-purple-600" />
                  </div>
                  Other Skills
                </label>
                <input
                  type="text"
                  id="otherSkills"
                  name="erpa_otherSkills"
                  placeholder="e.g., Computer Skills, Languages"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_otherSkills?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-purple-100 focus:border-purple-400  focus:ring-purple-100"} transition-colors`}
                  value={data.erpa_otherSkills}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Involvement Section */}
      <div className="bg-gradient-to-br from-white to-blue-50 p-5 rounded-lg shadow-md border border-blue-100 transition-all hover:shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-sm">
            <Users className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Community Involvement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 transition-all group-hover:shadow-md group-hover:border-blue-200">
              <div className={errors.erpa_schoolInvolvement ? "border-l-2 border-red-500 pl-3" : ""}>
                <label
                  htmlFor="schoolInvolvement"
                  className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_schoolInvolvement ? "text-red-600" : "text-gray-700"} mb-1.5`}
                >
                  <div className="p-1 bg-blue-100 rounded-md">
                    <BookOpen className="h-3 w-3 text-blue-600" />
                  </div>
                  School Involvement
                </label>
                <textarea
                  id="schoolInvolvement"
                  name="erpa_schoolInvolvement"
                  placeholder="Describe your involvement in school activities"
                  rows="2"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_schoolInvolvement?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-blue-100 focus:border-blue-400  focus:ring-blue-100"} transition-colors`}
                  value={data.erpa_schoolInvolvement}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 transition-all group-hover:shadow-md group-hover:border-blue-200">
              <div className={errors.erpa_civicInvolvement ? "border-l-2 border-red-500 pl-3" : ""}>
                <label
                  htmlFor="civicInvolvement"
                  className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_civicInvolvement ? "text-red-600" : "text-gray-700"} mb-1.5`}
                >
                  <div className="p-1 bg-blue-100 rounded-md">
                    <Users className="h-3 w-3 text-blue-600" />
                  </div>
                  Civic Involvement
                </label>
                <textarea
                  id="civicInvolvement"
                  name="erpa_civicInvolvement"
                  placeholder="Describe your involvement in civic organizations"
                  rows="2"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_civicInvolvement?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-blue-100 focus:border-blue-400  focus:ring-blue-100"} transition-colors`}
                  value={data.erpa_civicInvolvement}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 transition-all group-hover:shadow-md group-hover:border-blue-200">
              <div className={errors.erpa_communityInvolvement ? "border-l-2 border-red-500 pl-3" : ""}>
                <label
                  htmlFor="communityInvolvement"
                  className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_communityInvolvement ? "text-red-600" : "text-gray-700"} mb-1.5`}
                >
                  <div className="p-1 bg-blue-100 rounded-md">
                    <Users className="h-3 w-3 text-blue-600" />
                  </div>
                  Community Involvement
                </label>
                <textarea
                  id="communityInvolvement"
                  name="erpa_communityInvolvement"
                  placeholder="Describe your involvement in community projects"
                  rows="2"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_communityInvolvement?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-blue-100 focus:border-blue-400  focus:ring-blue-100"} transition-colors`}
                  value={data.erpa_communityInvolvement}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 transition-all group-hover:shadow-md group-hover:border-blue-200">
              <div className={errors.erpa_workplaceInvolvement ? "border-l-2 border-red-500 pl-3" : ""}>
                <label
                  htmlFor="workplaceInvolvement"
                  className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_workplaceInvolvement ? "text-red-600" : "text-gray-700"} mb-1.5`}
                >
                  <div className="p-1 bg-blue-100 rounded-md">
                    <Briefcase className="h-3 w-3 text-blue-600" />
                  </div>
                  Workplace Involvement
                </label>
                <textarea
                  id="workplaceInvolvement"
                  name="erpa_workplaceInvolvement"
                  placeholder="Describe your involvement in workplace committees"
                  rows="2"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_workplaceInvolvement?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-blue-100 focus:border-blue-400  focus:ring-blue-100"} transition-colors`}
                  value={data.erpa_workplaceInvolvement}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seminars and Trainings Section */}
      <div className="bg-gradient-to-br from-white to-green-50 p-5 rounded-lg shadow-md border border-green-100 transition-all hover:shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-sm">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
            Seminars and Trainings
          </h2>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 hover:shadow-md hover:border-green-200 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <div className={errors.erpa_seminarTitle ? "border-l-2 border-red-500 pl-3" : ""}>
                <label htmlFor="seminarTitle" className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_seminarTitle ? "text-red-600" : "text-gray-700"}`}>
                  <div className="p-1 bg-green-100 rounded-md">
                    <BookOpen className="h-3 w-3 text-green-600" />
                  </div>
                  Title
                </label>
                <input
                  type="text"
                  id="seminarTitle"
                  name="erpa_seminarTitle"
                  placeholder="Title of the seminar or training"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_seminarTitle?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-green-100 focus:border-green-400  focus:ring-green-100"} transition-colors`}
                  value={data.erpa_seminarTitle}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className={errors.erpa_seminarDate ? "border-l-2 border-red-500 pl-3" : ""}>
                <label htmlFor="seminarDate" className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_seminarDate ? "text-red-600" : "text-gray-700"}`}>
                  <div className="p-1 bg-green-100 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  Date
                </label>
                <input
                  type="date"
                  id="seminarDate"
                  name="erpa_seminarDate"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_seminarDate?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-green-100 focus:border-green-400  focus:ring-green-100"} transition-colors`}
                  value={data.erpa_seminarDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className={errors.erpa_seminarOrganizers ? "border-l-2 border-red-500 pl-3" : ""}>
                <label htmlFor="seminarOrganizers" className={`flex items-center gap-2 text-xs font-medium ${errors.erpa_seminarOrganizers ? "text-red-600" : "text-gray-700"}`}>
                  <div className="p-1 bg-green-100 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                      <path d="M2 17l10 5 10-5"></path>
                      <path d="M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  Organizers
                </label>
                <input
                  type="text"
                  id="seminarOrganizers"
                  name="erpa_seminarOrganizers"
                  placeholder="Name of organizing institution"
                  className={`w-full p-2 text-sm rounded-md focus:ring-1 ${errors.erpa_seminarOrganizers?"border border-red-600 focus:ring-red-500 focus:border-red-300":
                    "border-green-100 focus:border-green-400  focus:ring-green-100"} transition-colors`}
                  value={data.erpa_seminarOrganizers}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}