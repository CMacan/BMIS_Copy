<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\DocumentRequestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\FormController;
use App\Http\Controllers\Forms\FormsController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\Forms\LGBTFormController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\HouseholdController;
use App\Http\Controllers\CommitteeController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\CommitteeMemberController;
use App\Http\Controllers\ProfileVerificationController;
use App\Http\Controllers\ProofOfIdentityController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SignUpController;
use App\Http\Controllers\BarangayDetailsController;
use App\Http\Controllers\BarangayOfficialController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SectoralFormController;
use App\Http\Controllers\VotersController;
use App\Http\Controllers\PrecinctController;
use App\Http\Controllers\DocumentGeneratorController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\TicketCheckController;

Route::get('/', function () {
    return Inertia::render('View/Landingpage'); // Ensure Landingpage loads first
})->name('landing');
Route::get('/about', fn() => Inertia::render('View/About'));
Route::get('/about', [BarangayDetailsController::class, 'fetch_about'])->name('about');

Route::get('/announcements', [AnnouncementController::class, 'showLandingPage'])->name('landing.page');
Route::get('/announcement', fn() => Inertia::render('View/Announcement'));
Route::get('/service', fn() => Inertia::render('Services/Service'));
Route::get('/announcements/{id}', [AnnouncementController::class, 'show'])->name('announcements.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile-resident', [ProfileController::class, 'updateResident'])->name('profile.update.resident');
    Route::post('/profile/picture', [ProfileController::class, 'upload_picture'])->name('profile.update.picture');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
    Route::post('/household/{household}', [HouseholdController::class, 'update'])->name('household.update');
    Route::post('/household', [HouseholdController::class, 'store'])->name('household.create');
    Route::post('/household/join', [HouseholdController::class, 'join'])->name('household.join');
    Route::prefix('household/member')->name('household.member.')->group(function () {
        Route::post('/add', [HouseholdController::class, 'addMember'])->name('add');
        Route::get('/{id}', [HouseholdController::class, 'viewMember'])->name('view');
        Route::patch('/{id}', [HouseholdController::class, 'updMember'])->name('update');
        Route::delete('/{id}', [HouseholdController::class, 'delMember'])->name('delete');
    });

    // Notification routes - Fixed and properly grouped
    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::patch('/mark-as-read/{id}', [NotificationController::class, 'markAsRead'])->name('mark-as-read');
        Route::patch('/mark-all-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-read');
        Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
    });
});


// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('/dashboard/announcements', [UserDashboardController::class, 'announcement_list'])->name('announcement_list');

    Route::get('/complaint', function () {
        return Inertia::render('User/Complaint');
    });

    Route::get('/forms', [FormController::class, 'index']);
    Route::get('/forms/{id}', [FormController::class, 'show'])->name('forms.show');
    Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');

    Route::get('/user_request', [UserController::class, 'user_request'])->name('applications.user_request');


    Route::get('/senior-citizen', function () {
        return Inertia::render('User/Forms/SeniorCitizenForm');
    });

    Route::get('/children', function () {
        return Inertia::render('User/Forms/ChildrenIntakeForm');
    });

    Route::get('/LGBT', function () {
        return Inertia::render('User/Forms/LGBTForm');
    });
    Route::get('/LGBT/self', [LGBTFormController::class, 'showSelfForm'])->name('lgbt.self');
    Route::get('/LGBT/household', [LGBTFormController::class, 'showHouseholdForm'])->name('lgbt.household');
    Route::post('/submit', [FormController::class, 'submit'])->name('submit');

    Route::get('/womens', function () {
        return Inertia::render('User/Forms/Womens');
    });

    Route::get('/pwd', function () {
        return Inertia::render('User/Forms/PWD');
    });
    Route::get('/erpa', function () {
        return Inertia::render('User/Forms/ERPA');
    });
    Route::get('/solo', function () {
        return Inertia::render('User/Forms/SoloParent');
    });
    Route::get('/application', function () {
        return Inertia::render('User/Application/applications');
    });
    Route::get('/applications', [ApplicationController::class, 'index'])->name('applications.index');
});
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::get('/request-status', [UserController::class, 'request_status'])->name('request-status');

 
//admin
Route::middleware('auth')->group(function () {
    //dashboard
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/sectoral', [AdminController::class, 'sectoralGroups'])->name('admin.sectoral');
    Route::get('/admin/sectoral/{field}/members', [AdminController::class, 'SectoralMembers']);
    Route::get('/admin/residents/{id}/profile-data', [AdminController::class, 'getProfileData']);
    Route::get('/admin/barangaydetails', [AdminController::class, 'barangayDetails']);
    Route::get('/admin/committees', [CommitteeController::class, 'index'])->name('admin.committees');
    Route::post('/admin/committees', [CommitteeController::class, 'store'])->name('admin.committees.store');
    // Route to handle adding members
    Route::post('/admin/members', [MemberController::class, 'store'])->name('admin.members.store');
    // Route to fetch user by profile ID
    Route::get('/admin/users-by-profile/{profileId}', [MemberController::class, 'getUserByProfile']);
    Route::get('/admin/committees/{committeeId}/members', [MemberController::class, 'getMembersByCommittee']);

    //sign up requests
    Route::get('/admin/sign-up-requests', [AdminController::class, 'signUpRequests'])->name('admin.sign_up_requests');
    Route::get('/admin/sign-up-requests/{id}', [SignUpController::class, 'showSignUpRequest'])->name('admin.sign-up-requests.show');
    Route::post('/admin/sign-up-requests/{id}/approve', [SignUpController::class, 'approveSignUpRequest'])->name('admin.sign-up-requests.approve');
    Route::post('/admin/sign-up-requests/{id}/reject', [SignUpController::class, 'rejectSignUpRequest'])->name('admin.sign-up-requests.reject');

    //residents
    Route::get('/admin/residents', [AdminController::class, 'residents'])->name('admin.residents');
    Route::get('/admin/residents/{id}', [AdminController::class, 'showResident'])->name('admin.residents.show');
    Route::get('/admin/applications', [ApplicationController::class, 'adminIndex'])->name('admin.applications');

    Route::get('/admin/households', [AdminController::class, 'households'])->name('admin.households');

    //voters
    Route::get('/admin/voters', [VotersController::class, 'index'])->name('admin.voters');
    Route::post('/admin/voters', [VotersController::class, 'store'])->name('admin.voters.store');
    Route::put('/admin/voters/{voter}', [VotersController::class, 'update'])->name('admin.voters.update');
    Route::get('/admin/precincts', [PrecinctController::class, 'index'])->name('precincts.index');
    Route::post('/admin/precincts', [PrecinctController::class, 'store'])->name('precincts.store');
    Route::delete('/admin/voters/{voter}', [VotersController::class, 'destroy'])->name('admin.voters.destroy');

    //votersExport
    Route::get('/export-voters', [VotersController::class, 'export'])->name('export.voters');
    Route::get('/export-voters-pdf', [VotersController::class, 'exportPdf'])->name('voters.exportPdf');

    //
    Route::post('/admin/voters/import', [VotersController::class, 'import'])->name('admin.voters.import');
    Route::get('/admin/voters/import-template', [VotersController::class, 'downloadTemplate'])->name('voters.import.template');

    //sectoral
    Route::get('/admin/sectoral-forms', [SectoralFormController::class, 'index']);
    Route::post('/admin/sectoral-forms', [SectoralFormController::class, 'store']);
    Route::put('/admin/sectoral-update/{id}', [SectoralFormController::class, 'update']);
    Route::delete('/admin/sectoral-delete/{id}', [SectoralFormController::class, 'destroy']);
    // Make sure these are POST routes since you're modifying data
    Route::post('forms-to-verify/{id}/approve', [ApplicationController::class, 'approve'])
    ->name('admin.forms.approve');
    Route::post('forms-to-verify/{id}/decline', [ApplicationController::class, 'decline'])
        ->name('admin.forms.decline');
        // In routes/web.php

    Route::get('/forms-to-verify', [ApplicationController::class, 'adminIndex'])->name('admin.forms.verify');

    //all accounts
    Route::get('/admin/all-accounts', [ApplicationController::class, 'allAccounts'])->name('admin.all_accounts');
    Route::get('/admin/activity-logs', [AdminController::class, 'activityLogs'])->name('admin.activity_logs');
    Route::get('/admin/activity-logs/export', [AdminController::class, 'exportActivityLogs'])->name('admin.activity-logs.export');
    Route::get('/admin/all-accounts/roles', [AdminController::class, 'roles'])->name('admin.roles');
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
    Route::post('/roles/{role}/assign-permissions', [RoleController::class, 'assignPermission'])->name('roles.assign-permissions');
    Route::post('/roles/{role}/remove-permission', [RoleController::class, 'removePermission'])->name('roles.remove-permission');
    Route::post('/users/{user}/assign-role', [RoleController::class, 'assignRole'])->name('users.assign-role');
    Route::get('/users', [UserController::class, 'allUsers'])->name('users.index');

    // API route to fetch submission by ID (AJAX)
    // web.php
    Route::get('/admin/forms-to-verify/{id}', [ApplicationController::class, 'show']);

    Route::get('/admin/forms-to-verify', [AdminController::class, 'formsToVerify']);
    Route::post('/admin/forms-to-verify/{id}/update-status', [AdminController::class, 'updateStatus'])->name('admin.forms-to-verify.updateStatus');

    Route::put('/admin/all-accounts/user/{user}', [UserController::class, 'update'])->name('admin.all_accounts.user.update');
    Route::delete('/admin/all-accounts/user/{user}', [UserController::class, 'destroy'])->name('admin.all_accounts.user.destroy');
    
    Route::post('/admin/all-accounts', [UserController::class, 'store'])->name('admin.all_accounts.store');

    Route::get('/forms/{id}', [FormController::class, 'show'])->name('forms.show');
    //Complaint
    Route::get('/admin/complaints', [ComplaintController::class, 'index'])->name('admin.complaints');

    Route::post('/admin/complaints/{id}/update-status', [ComplaintController::class, 'updateStatus'])->name('admin.complaints.updateStatus');
    //Settings-barangaydetails
    Route::patch('/admin/barangay/update', [BarangayDetailsController::class, 'update'])->name('admin.update');
    Route::post('/admin/barangay/logo', [BarangayDetailsController::class, 'upload_logo'])->name('update.logo');
    Route::get('/admin/barangaydetails', [BarangayDetailsController::class, 'show'])->name('admin.barangaydetails'); //Fetch data

    Route::get('/admin/account', [AdminController::class, 'account'])->name('admin.account'); //Fetch data

    //Barangay Officials
    Route::get('/admin/brgy-officials', [BarangayOfficialController::class, 'index'])->name('barangay-officials.index');
    Route::post('/admin/barangay-officials', [BarangayOfficialController::class, 'store'])->name('barangay-officials.store');
    Route::get('/admin/barangay-officials/{id}', [BarangayOfficialController::class, 'show'])->name('barangay-officials.show');
    Route::put('/admin/barangay-officials/{id}', [BarangayOfficialController::class, 'update'])->name('barangay-officials.update');

    //announcements
    Route::get('/admin/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::post('/admin/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::get('/admin/announcements/{announcement}/edit', [AnnouncementController::class, 'edit'])->name('announcements.edit');
    Route::put('/admin/announcements/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update');
    Route::delete('/admin/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
});

// Admin-side routes
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/document-requests', [DocumentRequestController::class, 'index'])->name('admin.document-requests');
    Route::put('/admin/document-requests/{id}/update-status', [DocumentRequestController::class, 'updateStatus'])->name('admin.document-requests.updateStatus');
    Route::get('/admin/document-requests/export', [DocumentRequestController::class, 'export'])->name('admin.document-requests.export');
    Route::get('/admin/document-requests/{id}/print', [DocumentRequestController::class, 'print'])->name('admin.document-requests.print');
    Route::get('/admin/document-requests/{id}', [DocumentRequestController::class, 'show'])->name('admin.document-requests.show');
    Route::get('/admin/document-requests/{id}/export-pdf', [DocumentRequestController::class, 'exportPdf'])->name('admin.document-requests.exportPdf');
    Route::get('/admin/document-requests/{id}/generate-docx', [DocumentGeneratorController::class, 'generate'])
        ->name('admin.document-requests.generate-docx');

    Route::get('/admin/profiles', [ProfileController::class, 'getAllProfiles'])->name('admin.profiles.index');
    Route::post('/admin/profiles', [ProfileController::class, 'store'])->name('admin.profile.store');
});

// User-side routes
Route::middleware('auth')->group(function () {
    Route::get('/user/document-requests', [DocumentRequestController::class, 'userIndex'])->name('user.document-requests.index');
    Route::get('/user/document-requests/history', [DocumentRequestController::class, 'history'])->name('user.document-requests.history');
    Route::post('/user/document-requests/store', [DocumentRequestController::class, 'store'])->name('user.document-requests.store');
});

// Profile Verification Routes
Route::get('/profile-verification', [ProfileVerificationController::class, 'index'])->name('profile.verification');
Route::post('/profile-verification', [ProfileVerificationController::class, 'store']);

// Proof of Identity Routes
Route::get('/proof-of-identity', [ProofOfIdentityController::class, 'index'])->name('profile.identity');
Route::post('/proof-of-identity', [ProofOfIdentityController::class, 'store']);
Route::post('/proof-of-identity/complete', [ProofOfIdentityController::class, 'complete'])->name('profile.identity.complete');

// Services route
Route::get('/services', function () {
    return Inertia::render('Services/Service');
})->name('services'); // Make sure this has a name

// Ticket Check Routes
Route::get('/ticket-check', [TicketCheckController::class, 'index'])->name('ticket.check');
Route::post('/ticket-check', [TicketCheckController::class, 'checkStatus'])->name('ticket.check.status');

require __DIR__ . '/auth.php';


// Test route for debugging
Route::get('/test-route', function () {
    try {
        Log::info('Test route accessed successfully.');
        return response()->json(['message' => 'Test route is working!']);
    } catch (\Exception $e) {
        Log::error('Error in test route:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Test route failed. Check the logs for details.'], 500);
    }
});

Route::get('/debug-db', function () {
    return [
        'DB_CONNECTION' => config('database.default'),
        'DB_HOST' => config('database.connections.pgsql.host'),
        'DB_DATABASE' => config('database.connections.pgsql.database'),
        'DB_USERNAME' => config('database.connections.pgsql.username'),
    ];
});

require __DIR__ . '/auth.php';

//main landing page route
Route::get('/main-landing', function () {
    return Inertia::render('MainPage/mainlanding');
});
