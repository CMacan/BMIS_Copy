import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"

export default function PersonalDetailsSection({ data, setData, errors }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <InputLabel htmlFor="prof_gender" value="Sex" />
        <select
          id="prof_gender"
          className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-400 focus:ring-indigo-400"
          value={data.prof_gender || ""}
          onChange={(e) => setData("prof_gender", e.target.value)}
          required
        >
          <option value="">Select Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <InputError className="mt-2" message={errors.prof_gender} />
      </div>

      <div>
        <InputLabel htmlFor="prof_religion" value="Religion" />
        <TextInput
          id="prof_religion"
          className="mt-1 block w-full"
          value={data.prof_religion || ""}
          onChange={(e) => setData("prof_religion", e.target.value)}
        />
        <InputError className="mt-2" message={errors.prof_religion} />
      </div>

      <div>
        <InputLabel htmlFor="prof_cstatus" value="Civil Status" />
        <select
          id="prof_cstatus"
          className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-400 focus:ring-indigo-400"
          value={data.prof_cstatus || ""}
          onChange={(e) => setData("prof_cstatus", e.target.value)}
          required
        >
          <option value="">Select Civil Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="widowed">Widowed</option>
          <option value="divorced">Divorced</option>
          <option value="separated">Separated</option>
        </select>
        <InputError className="mt-2" message={errors.prof_cstatus} />
      </div>

      <div>
        <InputLabel htmlFor="prof_educattain" value="Educational Attainment" />
        <select
          id="prof_educattain"
          className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-400 focus:ring-indigo-400"
          value={data.prof_educattain || ""}
          onChange={(e) => setData("prof_educattain", e.target.value)}
        >
          <option value="">Select Educational Attainment</option>
          <option value="elementary">Elementary</option>
          <option value="high school">High School</option>
          <option value="college">College</option>
          <option value="vocational">Vocational</option>
          <option value="post graduate">Post Graduate</option>
        </select>
        <InputError className="mt-2" message={errors.prof_educattain} />
      </div>

      <div>
        <InputLabel htmlFor="prof_occupation" value="Occupation" />
        <TextInput
          id="prof_occupation"
          className="mt-1 block w-full"
          value={data.prof_occupation || ""}
          onChange={(e) => setData("prof_occupation", e.target.value)}
        />
        <InputError className="mt-2" message={errors.prof_occupation} />
      </div>

      <div>
        <InputLabel htmlFor="prof_is_4ps" value="Are you a 4ps member?" />
        <select
          id="prof_is_4ps"
          className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-indigo-400 focus:ring-indigo-400"
          value={data.prof_is_4ps || ""}
          onChange={(e) => setData("prof_is_4ps", e.target.value)}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </select>
        <InputError className="mt-2" message={errors.prof_is_4ps} />
      </div>
    </div>
  )
}

