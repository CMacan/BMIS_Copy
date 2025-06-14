<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            'user_contact' => ['nullable', 'string', 'max:15'],
            'prof_fname' => ['required', 'string', 'max:255'],
            'prof_lname' => ['required', 'string', 'max:255'],
            'prof_mname' => ['nullable', 'string', 'max:255'],
            'prof_suffix' => ['nullable', 'string', 'max:10'],
            'prof_sex' => ['required', 'string', 'max:10'],
            'prof_religion' => ['nullable', 'string', 'max:255'],
            'prof_cstatus' => ['nullable', 'string', 'max:255'],
            'prof_educattain' => ['nullable', 'string', 'max:255'],
            'prof_occupation' => ['nullable', 'string', 'max:255'],
        
            ],
        ];
    }
}
