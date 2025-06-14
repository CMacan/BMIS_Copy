<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Household;
use App\Models\Permission;
use App\Models\Profile;
use App\Models\TempSubmission;
use App\Models\Role;
use App\Models\RolePermission;
use App\Models\SignUpRequest;
use App\Models\User;
use App\Models\Voter;
use App\Models\BarangayOfficial;
use App\Models\Announcement;
use App\Models\DocumentRequest;
use App\Models\ResidentSectorMembership;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\ActivityLogsExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; // Add this import

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user()->load('profile'); // Ensure profile is loaded

        // Fetch data dynamically from the database
        $totalResidents = Profile::count();
        $pendingAccountRequests = SignUpRequest::count();
        $pendingRequests = DocumentRequest::count();
        $accountsToVerify = Profile::where('prof_is_verified', false)->count();
        $formsToVerify = TempSubmission::where('status', 'pending')->count();

        // Fetch announcements
        $announcements = Announcement::latest()->take(5)->get(); // Fetch the latest 5 announcements

        // Resident demographics data
        $residentData = [
            ['name' => 'Voters', 'value' => Voter::count()],
            ['name' => 'Senior Citizens', 'value' => Profile::where('prof_age', '>=', 60)->count()],
            ['name' => 'Youth', 'value' => Profile::whereBetween('prof_age', [18, 35])->count()],
            ['name' => 'Others', 'value' => Profile::where('prof_age', '<', 18)->count()],
        ];
         // Sectoral groups data with counts and percentages
        $sectoralCounts = [
            'LGBTQ+' => ResidentSectorMembership::where('mem_is_lgbt', true)->count(),
            'Women' => ResidentSectorMembership::where('mem_is_women', true)->count(),
            'Solo Parent' => ResidentSectorMembership::where('mem_is_solo_parent', true)->count(),
            'Senior Citizens' => ResidentSectorMembership::where('mem_is_senior', true)->count(),
            'PWD' => ResidentSectorMembership::where('mem_is_pwd', true)->count(),
            'Children' => ResidentSectorMembership::where('mem_is_children', true)->count(),
            'ERPA' => ResidentSectorMembership::where('mem_is_erpa', true)->count(),
        ];
        // Calculate percentages
        $sectoralData = collect($sectoralCounts)->map(function ($count, $name) use ($totalResidents) {
            return [
                'name' => $name,
                'count' => $count,
                'percentage' => $totalResidents > 0 ? round(($count / $totalResidents) * 100) : 0,
            ];
        })->values()->toArray();
        // Monthly activity data
        $monthlyData = [
            ['name' => 'Jan', 'certificates' => 65, 'complaints' => 28],
            ['name' => 'Feb', 'certificates' => 59, 'complaints' => 32],
            ['name' => 'Mar', 'certificates' => 80, 'complaints' => 41],
            ['name' => 'Apr', 'certificates' => 81, 'complaints' => 34],
            ['name' => 'May', 'certificates' => 56, 'complaints' => 25],
            ['name' => 'Jun', 'certificates' => 55, 'complaints' => 30],
        ];

        return Inertia::render('Admin/AdminDashboard', [
            'auth' => [
                'user' => $user,
                'profile' => $user->profile,
            ],
            'dashboardData' => [
                'totalResidents' => $totalResidents,
                'pendingRequests' => $pendingRequests,
                'accountsToVerify' => $accountsToVerify,
                'formsToVerify' => $formsToVerify,
                'sectoralData' => $sectoralData,
                'residentData' => $residentData,
                'monthlyData' => $monthlyData,
            ],
            'announcements' => $announcements,
        ]);
    }
    public function sectoralGroups(Request $request)
    {
        $totalResidents = Profile::count();
        
        $sectoralGroups = [
            [
                'name' => 'LGBTQ+',
                'count' => ResidentSectorMembership::where('mem_is_lgbt', true)->count(),
                'field' => 'mem_is_lgbt'
            ],
            [
                'name' => 'Women',
                'count' => ResidentSectorMembership::where('mem_is_women', true)->count(),
                'field' => 'mem_is_women'
            ],
            [
                'name' => 'Solo Parent',
                'count' => ResidentSectorMembership::where('mem_is_solo_parent', true)->count(),
                'field' => 'mem_is_solo_parent'
            ],
            [
                'name' => 'Senior Citizens',
                'count' => ResidentSectorMembership::where('mem_is_senior', true)->count(),
                'field' => 'mem_is_senior'
            ],
            [
                'name' => 'PWD',
                'count' => ResidentSectorMembership::where('mem_is_pwd', true)->count(),
                'field' => 'mem_is_pwd'
            ],
            [
                'name' => 'Children',
                'count' => ResidentSectorMembership::where('mem_is_children', true)->count(),
                'field' => 'mem_is_children'
            ],
            [
                'name' => 'ERPA',
                'count' => ResidentSectorMembership::where('mem_is_erpa', true)->count(),
                'field' => 'mem_is_erpa'
            ],

            // Add all other sectoral groups...
        ];

        // Calculate percentages
        $sectoralGroups = array_map(function($group) use ($totalResidents) {
            $group['percentage'] = $totalResidents > 0 
                ? round(($group['count'] / $totalResidents) * 100, 2)
                : 0;
            return $group;
        }, $sectoralGroups);

        return Inertia::render('Admin/SectoralGroups', [
            'sectoralGroups' => $sectoralGroups,
            'totalResidents' => $totalResidents
        ]);
    }
    
    public function sectoralMembers(Request $request, $field)
{
    $validFields = [
        'mem_is_lgbt' => 'LGBTQ+',
        'mem_is_women' => 'Women',
        'mem_is_solo_parent' => 'Solo Parent',
        'mem_is_senior' => 'Senior Citizens',
        'mem_is_pwd' => 'PWD',
        'mem_is_children' => 'Children',
        'mem_is_erpa' => 'ERPA',
    ];

    if (!array_key_exists($field, $validFields)) {
        abort(404);
    }

    // Query the memberships table and join with profiles
    $members = ResidentSectorMembership::where($field, true)
        ->join('profiles', 'resident_sector_memberships.prof_id', '=', 'profiles.id')
        ->select(
            'resident_sector_memberships.id as sec_mem_id',
            'profiles.id as prof_id',
            'profiles.prof_fname',
            'profiles.prof_lname',
            'profiles.prof_mname',
            'profiles.prof_birthdate'
        )
        ->paginate(15);

    return Inertia::render('Admin/SectoralMembers', [
        'members' => $members,
        'groupName' => $validFields[$field],
        'groupField' => $field,
    ]);
}
    //View Profile in sectoral members
    public function getProfileData($id)
{
    // Find membership first
    $membership = ResidentSectorMembership::with('profile.voter')->findOrFail($id);

    // Access profile through relationship
    $profile = $membership->profile;

    // Determine sectoral groups from membership flags
    $sectoralGroups = [];
    if ($membership->mem_is_lgbt) $sectoralGroups[] = 'LGBT';
    if ($membership->mem_is_women) $sectoralGroups[] = 'Women';
    if ($membership->mem_is_solo_parent) $sectoralGroups[] = 'Solo Parent';
    if ($membership->mem_is_senior) $sectoralGroups[] = 'Senior Citizen';
    if ($membership->mem_is_pwd) $sectoralGroups[] = 'PWD';
    if ($membership->mem_is_children) $sectoralGroups[] = 'Children';
    if ($membership->mem_is_erpa) $sectoralGroups[] = 'ERPA';

    // Handle profile picture URL
    $profilePictureUrl = $profile->prof_picture
        ? Storage::url($profile->prof_picture)
        : null;

    return response()->json([
        'prof_fname' => $profile->prof_fname,
        'prof_mname' => $profile->prof_mname,
        'prof_lname' => $profile->prof_lname,
        'prof_birthdate' => $profile->prof_birthdate,
        'prof_gender' => $profile->prof_gender,
        'prof_civil_status' => $profile->prof_cstatus,
        'prof_phone' => $profile->prof_phone ?? null,
        'prof_email' => $profile->prof_email ?? null,
        'prof_address' => $profile->prof_address ?? null,
        'prof_occupation' => $profile->prof_occupation ?? null,
        'prof_education' => $profile->prof_educattain ?? null,
        'is_voter' => $profile->voter !== null,
        'sectoral_groups' => $sectoralGroups,
        'profile_picture_url' => $profilePictureUrl,
    ]);
}
    public function barangayDetails(Request $request)
    {
        return Inertia::render('Admin/BarangayDetails');
    }


    public function barangayOfficials(Request $request)
    {
        $authUser = $request->user()->load('profile', 'role.permissions');
        $officials = BarangayOfficial::all();

        return Inertia::render('Admin/Officials/BarangayOfficials', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                // It's possible for permissions to be null during testing or setup, so we default to an empty collection
                'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions->unique('id') : collect(),
            ],
            'officials' => $officials ?? [],
        ]);
    }

    public function residents(Request $request)
    {
        $authUser = $request->user()->load('profile', 'role.permissions');
        $users = User::with('profile')->get();
        $profiles = Profile::doesntHave('user')->get();

        return Inertia::render('Admin/Residents', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                // It's possible for permissions to be null during testing or setup, so we default to an empty collection
                'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions->unique('id') : collect(),
            ],
            'users' => $users,
            'profiles' => $profiles,
        ]);
    }

    public function voters(Request $request)
    {
        $authUser = $request->user()->load('profile', 'role.permissions');
        $voters = Voter::all();

        return Inertia::render('Admin/Voters', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                // It's possible for permissions to be null during testing or setup, so we default to an empty collection
                'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions->unique('id') : collect(),
            ],
            'voters' => $voters,
        ]);
    }

    public function households(Request $request)
    {
        $authUser = $request->user()->load('profile', 'role.permissions');
        $households = Household::all();

        return Inertia::render('Admin/Households', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                // It's possible for permissions to be null during testing or setup, so we default to an empty collection
                'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions->unique('id') : collect(),
            ],
            'households' => $households,
        ]);
    }

    public function account(Request $request)
    {
        $authUser = $request->user()->load('profile', 'role.permissions');

        return Inertia::render('Admin/Account', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                // It's possible for permissions to be null during testing or setup, so we default to an empty collection
                'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions->unique('id') : collect(),
            ],
        ]);
    }

    public function roles(Request $request)
    {
        try {
            $authUser = $request->user()->load('profile', 'role.permissions'); // Load the user's single role and its permissions
            $role = Role::with('permissions')->get(); // Fetch all role with their permissions
            $permissions = Permission::all(); // Fetch all permissions
            $users = User::with('profile', 'role')->get(); // Fetch all users with their profiles and assigned role

            return Inertia::render('Admin/Roles', [
                'auth' => [
                    'user' => $authUser,
                    'role' => $authUser->role, // Single role for the authenticated user
                    // It's possible for permissions to be null during testing or setup, so we default to an empty array
                    'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions : [],
                ],
                'role' => $role, // All role
                'permissions' => $permissions, // All permissions
                'users' => $users, // All users with their profiles and role
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching role data: ' . $e->getMessage()); // Log the error
            return back()->with('error', 'Failed to load role data.');
        }
    }

    
    public function signUpRequests(Request $request)
    {
        $authUser = $request->user()->load('profile', 'role.permissions');
        $signUpRequests = SignUpRequest::all();

        return Inertia::render('Admin/SignUpRequests', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                // It's possible for permissions to be null during testing or setup, so we default to an empty collection
                'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions->unique('id') : collect(),
            ],
            'signUpRequests' => $signUpRequests,
        ]);
    }

    public function activityLogs(Request $request)
    {
        $authUser = $request->user()->load('profile', 'role.permissions');
        $activityLogs = ActivityLog::all();

        return Inertia::render('Admin/ActivityLogs', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                // It's possible for permissions to be null during testing or setup, so we default to an empty collection
                'permissions' => $authUser->role && $authUser->role->permissions ? $authUser->role->permissions->unique('id') : collect(),
            ],
            'logs' => $activityLogs,
        ]);
    }

    public function exportActivityLogs(Request $request)
    {
        $filters = [
            'log_table' => $request->query('log_table'),
            'log_action' => $request->query('log_action'),
            'date_start' => $request->query('date_start'),
            'date_end' => $request->query('date_end'),
        ];

        return Excel::download(new ActivityLogsExport($filters), 'activity_logs.xlsx');
    }

    public function formsToVerify(Request $request)
    {
        return Inertia::render('Admin/FormsToVerify');
    }

    public function showFormToVerify(Request $request, $id)
    {
        return Inertia::render('Admin/FormsToVerify', ['id' => $id]);
    }

    public function applications(Request $request)
    {
        $authUser = request()->user()->load('profile', 'role.permissions');
    
        // Check if the ProfileVerification model exists, otherwise use ProfileVer
        try {
            $applications = \App\Models\ProfileVer::latest()->paginate(10);
        } catch (\Exception $e) {
            // Fallback to ProfileVer if ProfileVerification doesn't exist
            $applications = \App\Models\ProfileVer::latest()->paginate(10);
        }
        
        return Inertia::render('Admin/Applications', [
            'auth' => [
                'user' => $authUser,
                'role' => $authUser->role,
                'permissions' => $authUser->role->flatMap->permissions->unique('id'),
            ],
            'applications' => $applications
        ]);
    }
    
    public function updateApplicationStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:pending,submitted,approved,rejected',
        ]);
        
        try {
            // Try to find the application using ProfileVerification model
            $application = \App\Models\ProfileVer::findOrFail($id);
        } catch (\Exception $e) {
            // Fallback to ProfileVer if ProfileVerification doesn't exist
            $application = \App\Models\ProfileVer::findOrFail($id);
        }
        
        $application->update([
            'status' => $validated['status']
        ]);
        
        return back()->with('success', 'Application status updated successfully');
    }
}
