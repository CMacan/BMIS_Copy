<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Senior extends Model
{
    use HasFactory;

    protected $fillable = [
        'sec_mem_id', 'snr_ref_code', 'snr_osca_id_num', 'snr_ethnic_origin',
        'snr_dialect', 'snr_gsis_sss', 'snr_tin', 'snr_philhealth',
        'snr_sc_association_id_num', 'snr_other_govt_id', 'snr_capability_to_travel',
        'snr_svc_biz_emp', 'snr_cur_pension', 'snr_area_of_specialization',
        'snr_share_skill', 'snr_comm_serv_involve', 'snr_residing_with',
        'snr_src_of_inc', 'snr_immovable_asset', 'snr_movable_asset',
        'snr_monthly_inc', 'snr_problem_need', 'snr_medic_concern',
        'snr_dental_concern', 'snr_optical', 'snr_hearing',
        'snr_social_emotional', 'snr_medic_maintenance', 'snr_diff',
        'snr_has_medical_checkup', 'snr_medical_checkup_date'
    ];

    // public function profile() {
    //     return $this->belongsTo(Profile::class, 'prof_id');
    // }
    public function membership()
{
    return $this->belongsTo(ResidentSectorMembership::class, 'sec_mem_id');
}
}
