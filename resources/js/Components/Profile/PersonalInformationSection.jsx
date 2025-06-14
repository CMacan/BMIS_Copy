import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"

export default function PersonalInformationSection({ data, setData, errors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <InputLabel htmlFor="prof_fname" value="First Name" />
        <TextInput
          id="prof_fname"
          className="mt-1 block w-full"
          value={data.prof_fname || ""}
          onChange={(e) => setData("prof_fname", e.target.value)}
          required
        />
        <InputError className="mt-2" message={errors.prof_fname} />
      </div>

      <div>
        <InputLabel htmlFor="prof_lname" value="Last Name" />
        <TextInput
          id="prof_lname"
          className="mt-1 block w-full"
          value={data.prof_lname || ""}
          onChange={(e) => setData("prof_lname", e.target.value)}
          required
        />
        <InputError className="mt-2" message={errors.prof_lname} />
      </div>

      <div>
        <InputLabel htmlFor="prof_mname" value="Middle Name" />
        <TextInput
          id="prof_mname"
          className="mt-1 block w-full"
          value={data.prof_mname || ""}
          onChange={(e) => setData("prof_mname", e.target.value)}
        />
        <InputError className="mt-2" message={errors.prof_mname} />
      </div>

      <div>
        <InputLabel htmlFor="prof_suffix" value="Suffix" />
        <select
          id="prof_suffix"
          className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-400 focus:ring-indigo-400"
          value={data.prof_suffix || ""}
          onChange={(e) => setData("prof_suffix", e.target.value)}
        >
          <option value="">Select Suffix</option>
          <option value="Jr.">Jr.</option>
          <option value="Sr.">Sr.</option>
          <option value="II">II</option>
          <option value="III">III</option>
          <option value="IV">IV</option>
          <option value="V">V</option>
        </select>
        <InputError className="mt-2" message={errors.prof_suffix} />
      </div>

      <div>
        <InputLabel htmlFor="prof_birthdate" value="Date of Birth" />
        <TextInput
          id="prof_birthdate"
          type="date"
          className="mt-1 block w-full"
          value={data.prof_birthdate || ""}
          onChange={(e) => setData("prof_birthdate", e.target.value)}
          max={new Date().toISOString().split("T")[0]}
        />
        <InputError className="mt-2" message={errors.prof_birthdate} />
      </div>
    </div>
  )
}

