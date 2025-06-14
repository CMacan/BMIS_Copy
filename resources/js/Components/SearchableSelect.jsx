import React, { useState } from "react";
import { Combobox } from "@headlessui/react";

export default function SearchableSelect({ profiles = [], selectedProfile, setSelectedProfile }) {
  const [query, setQuery] = useState("");

  const filteredProfiles =
    query === ""
      ? profiles
      : profiles.filter((profile) => {
          const fullName = `${profile.prof_lname} ${profile.prof_fname}`.toLowerCase();
          return fullName.includes(query.toLowerCase());
        });

  return (
    <Combobox value={selectedProfile} onChange={setSelectedProfile}>
      <Combobox.Input
        className="w-full border rounded-md p-2"
        displayValue={(profile) =>
          profile ? `${profile.prof_lname} ${profile.prof_fname}` : ""
        }
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search profile by name"
      />
      <Combobox.Options className="mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
        {filteredProfiles.length === 0 && query !== "" ? (
          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
            No profiles found.
          </div>
        ) : (
          filteredProfiles.map((profile) => (
            <Combobox.Option
              key={profile.id}
              value={profile}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? "bg-blue-100" : "text-gray-900"
                }`
              }
            >
              {`${profile.prof_lname} ${profile.prof_fname}`}
            </Combobox.Option>
          ))
        )}
      </Combobox.Options>
    </Combobox>
  );
}