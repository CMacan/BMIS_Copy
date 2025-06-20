PGDMP  
                    }            barangaysawang    17.2    17.2 W   �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    16452    barangaysawang    DATABASE     �   CREATE DATABASE barangaysawang WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE barangaysawang;
                     postgres    false            �            1259    21320    activity_logs    TABLE     :  CREATE TABLE public.activity_logs (
    id bigint NOT NULL,
    log_action character varying(255) NOT NULL,
    log_table character varying(255) NOT NULL,
    log_table_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 !   DROP TABLE public.activity_logs;
       public         heap r       postgres    false            �            1259    21319    activity_logs_id_seq    SEQUENCE     }   CREATE SEQUENCE public.activity_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.activity_logs_id_seq;
       public               postgres    false    243            �           0    0    activity_logs_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;
          public               postgres    false    242            �            1259    21377 	   addresses    TABLE     =  CREATE TABLE public.addresses (
    id bigint NOT NULL,
    addr_city character varying(255),
    addr_barangay character varying(255),
    addr_region character varying(255),
    addr_block character varying(255),
    addr_sitio character varying(255),
    addr_street character varying(255),
    addr_houseno character varying(255),
    addr_province character varying(255),
    addr_type character varying(255),
    house_id bigint,
    emerg_id bigint,
    prof_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.addresses;
       public         heap r       postgres    false            �            1259    21376    addresses_id_seq    SEQUENCE     y   CREATE SEQUENCE public.addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.addresses_id_seq;
       public               postgres    false    251                        0    0    addresses_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;
          public               postgres    false    250            �            1259    21200    announcements    TABLE     �  CREATE TABLE public.announcements (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    slug character varying(255) NOT NULL,
    publish_at timestamp(0) without time zone,
    is_published boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    picture character varying(255)
);
 !   DROP TABLE public.announcements;
       public         heap r       postgres    false            �            1259    21199    announcements_id_seq    SEQUENCE     }   CREATE SEQUENCE public.announcements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.announcements_id_seq;
       public               postgres    false    233                       0    0    announcements_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;
          public               postgres    false    232                       1259    21581    attachments    TABLE     �  CREATE TABLE public.attachments (
    id bigint NOT NULL,
    comp_id bigint,
    attach_path character varying(255) NOT NULL,
    attach_type character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    prof_id bigint,
    attach_src character varying(255),
    attach_name character varying(255),
    sign_up_id bigint,
    form_id bigint
);
    DROP TABLE public.attachments;
       public         heap r       postgres    false                       1259    21580    attachments_id_seq    SEQUENCE     {   CREATE SEQUENCE public.attachments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.attachments_id_seq;
       public               postgres    false    263                       0    0    attachments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;
          public               postgres    false    262                       1259    21609    barangay_officials    TABLE     ^  CREATE TABLE public.barangay_officials (
    id bigint NOT NULL,
    bar_off_position character varying(255) NOT NULL,
    bar_off_term_st text,
    bar_off_term_end text,
    bar_off_status text,
    bar_id bigint NOT NULL,
    prof_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 &   DROP TABLE public.barangay_officials;
       public         heap r       postgres    false            
           1259    21608    barangay_officials_id_seq    SEQUENCE     �   CREATE SEQUENCE public.barangay_officials_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.barangay_officials_id_seq;
       public               postgres    false    267                       0    0    barangay_officials_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.barangay_officials_id_seq OWNED BY public.barangay_officials.id;
          public               postgres    false    266            �            1259    21401 	   barangays    TABLE     �  CREATE TABLE public.barangays (
    id bigint NOT NULL,
    bar_name character varying(255) DEFAULT 'Sawang Calero'::character varying NOT NULL,
    bar_gmaplink character varying(500) NOT NULL,
    municipal_or_city character varying(255),
    bar_prov character varying(255) DEFAULT 'Cebu'::character varying NOT NULL,
    bar_contact character varying(255),
    bar_email character varying(255),
    bar_fb_link character varying(500) NOT NULL,
    bar_stday character varying(255),
    bar_endday character varying(255),
    bar_sthour time(0) without time zone,
    bar_endhour time(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    bar_logo character varying(255),
    bar_motto character varying(255),
    bar_systname character varying(255),
    bar_vision text,
    bar_mission text,
    bar_value text,
    facebook character varying(255),
    bar_location character varying(250)
);
    DROP TABLE public.barangays;
       public         heap r       postgres    false            �            1259    21400    barangays_id_seq    SEQUENCE     y   CREATE SEQUENCE public.barangays_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.barangays_id_seq;
       public               postgres    false    253                       0    0    barangays_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.barangays_id_seq OWNED BY public.barangays.id;
          public               postgres    false    252            �            1259    21147    cache    TABLE     �   CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache;
       public         heap r       postgres    false            �            1259    21154    cache_locks    TABLE     �   CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache_locks;
       public         heap r       postgres    false                       1259    22245 	   childrens    TABLE     �   CREATE TABLE public.childrens (
    prof_id bigint NOT NULL,
    child_parent character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.childrens;
       public         heap r       postgres    false                       1259    21564    committee_members    TABLE     �   CREATE TABLE public.committee_members (
    id bigint NOT NULL,
    com_id bigint NOT NULL,
    member_id bigint NOT NULL,
    com_mem_assigned_date date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 %   DROP TABLE public.committee_members;
       public         heap r       postgres    false                       1259    21563    committee_members_id_seq    SEQUENCE     �   CREATE SEQUENCE public.committee_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.committee_members_id_seq;
       public               postgres    false    261                       0    0    committee_members_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.committee_members_id_seq OWNED BY public.committee_members.id;
          public               postgres    false    260            �            1259    21514 
   committees    TABLE     �   CREATE TABLE public.committees (
    id bigint NOT NULL,
    com_name character varying(255) NOT NULL,
    com_description text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.committees;
       public         heap r       postgres    false            �            1259    21513    committees_id_seq    SEQUENCE     z   CREATE SEQUENCE public.committees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.committees_id_seq;
       public               postgres    false    255                       0    0    committees_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.committees_id_seq OWNED BY public.committees.id;
          public               postgres    false    254            	           1259    21595    complaint_status_histories    TABLE       CREATE TABLE public.complaint_status_histories (
    id bigint NOT NULL,
    comp_id bigint NOT NULL,
    comp_hist_status character varying(255) NOT NULL,
    comp_hist_notes text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 .   DROP TABLE public.complaint_status_histories;
       public         heap r       postgres    false                       1259    21594 !   complaint_status_histories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.complaint_status_histories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 8   DROP SEQUENCE public.complaint_status_histories_id_seq;
       public               postgres    false    265                       0    0 !   complaint_status_histories_id_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE public.complaint_status_histories_id_seq OWNED BY public.complaint_status_histories.id;
          public               postgres    false    264                       1259    21523 
   complaints    TABLE       CREATE TABLE public.complaints (
    id bigint NOT NULL,
    comp_title character varying(255) NOT NULL,
    comp_description text NOT NULL,
    comp_location character varying(255),
    comp_status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    comp_priority_level integer DEFAULT 1 NOT NULL,
    comp_resol_details text,
    comp_resolution_date date,
    user_id bigint NOT NULL,
    com_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.complaints;
       public         heap r       postgres    false                        1259    21522    complaints_id_seq    SEQUENCE     z   CREATE SEQUENCE public.complaints_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.complaints_id_seq;
       public               postgres    false    257                       0    0    complaints_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;
          public               postgres    false    256                       1259    21722    document_requests    TABLE     �  CREATE TABLE public.document_requests (
    id bigint NOT NULL,
    user_id bigint,
    name character varying(255),
    address character varying(255),
    age integer,
    block character varying(255),
    civil_status character varying(255),
    copies integer DEFAULT 1 NOT NULL,
    purpose character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    document_type character varying(255) NOT NULL,
    staff_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    requester_name character varying(255),
    requester_email character varying(255),
    requester_contact character varying(255)
);
 %   DROP TABLE public.document_requests;
       public         heap r       postgres    false                       1259    21721    document_requests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.document_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.document_requests_id_seq;
       public               postgres    false    273            	           0    0    document_requests_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.document_requests_id_seq OWNED BY public.document_requests.id;
          public               postgres    false    272            �            1259    21363    emergency_contacts    TABLE     5  CREATE TABLE public.emergency_contacts (
    id bigint NOT NULL,
    emerg_fname character varying(255) NOT NULL,
    emerg_lname character varying(255) NOT NULL,
    emerg_relation character varying(255) NOT NULL,
    emerg_contact character varying(255) NOT NULL,
    emerg_cstatus character varying(255),
    emerg_educattain character varying(255),
    emerg_occupation character varying(255),
    emerg_restype character varying(255),
    prof_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 &   DROP TABLE public.emergency_contacts;
       public         heap r       postgres    false            �            1259    21362    emergency_contacts_id_seq    SEQUENCE     �   CREATE SEQUENCE public.emergency_contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.emergency_contacts_id_seq;
       public               postgres    false    249            
           0    0    emergency_contacts_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.emergency_contacts_id_seq OWNED BY public.emergency_contacts.id;
          public               postgres    false    248                       1259    22290    erpas    TABLE     �  CREATE TABLE public.erpas (
    prof_id bigint NOT NULL,
    erpa_tal text,
    erpa_hobb text,
    erpa_other_skill text,
    erpa_school text,
    erpa_civic text,
    erpa_community text,
    erpa_workplace text,
    erpa_seminar_title text,
    erpa_seminar_date date,
    erpa_seminar_organizer text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.erpas;
       public         heap r       postgres    false            �            1259    21179    failed_jobs    TABLE     &  CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.failed_jobs;
       public         heap r       postgres    false            �            1259    21178    failed_jobs_id_seq    SEQUENCE     {   CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.failed_jobs_id_seq;
       public               postgres    false    229                       0    0    failed_jobs_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;
          public               postgres    false    228            �            1259    21305 	   feedbacks    TABLE     T  CREATE TABLE public.feedbacks (
    id bigint NOT NULL,
    feed_title character varying(255),
    feed_message text NOT NULL,
    feed_submit_date timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.feedbacks;
       public         heap r       postgres    false            �            1259    21304    feedbacks_id_seq    SEQUENCE     y   CREATE SEQUENCE public.feedbacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.feedbacks_id_seq;
       public               postgres    false    241                       0    0    feedbacks_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.feedbacks_id_seq OWNED BY public.feedbacks.id;
          public               postgres    false    240                       1259    21684    household_join_requests    TABLE     :  CREATE TABLE public.household_join_requests (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    house_id bigint NOT NULL,
    house_j_status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 +   DROP TABLE public.household_join_requests;
       public         heap r       postgres    false                       1259    21683    household_join_requests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.household_join_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE public.household_join_requests_id_seq;
       public               postgres    false    271                       0    0    household_join_requests_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.household_join_requests_id_seq OWNED BY public.household_join_requests.id;
          public               postgres    false    270                       1259    22114    household_members    TABLE     �  CREATE TABLE public.household_members (
    id bigint NOT NULL,
    hmemb_relation character varying(255) NOT NULL,
    hmemb_is_primary_contact boolean DEFAULT false NOT NULL,
    hmemb_working_status character varying(255),
    hmemb_is_dependent boolean DEFAULT false NOT NULL,
    hmemb_is_guardian boolean DEFAULT false NOT NULL,
    house_id bigint NOT NULL,
    prof_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 %   DROP TABLE public.household_members;
       public         heap r       postgres    false                       1259    22113    household_members_id_seq    SEQUENCE     �   CREATE SEQUENCE public.household_members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.household_members_id_seq;
       public               postgres    false    275                       0    0    household_members_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.household_members_id_seq OWNED BY public.household_members.id;
          public               postgres    false    274            �            1259    21334 
   households    TABLE     G  CREATE TABLE public.households (
    id bigint NOT NULL,
    house_name character varying(255),
    house_util_access text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    house_type character varying(255),
    house_ownership character varying(255),
    house_year integer
);
    DROP TABLE public.households;
       public         heap r       postgres    false            �            1259    21333    households_id_seq    SEQUENCE     z   CREATE SEQUENCE public.households_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.households_id_seq;
       public               postgres    false    245                       0    0    households_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.households_id_seq OWNED BY public.households.id;
          public               postgres    false    244            �            1259    21171    job_batches    TABLE     d  CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);
    DROP TABLE public.job_batches;
       public         heap r       postgres    false            �            1259    21162    jobs    TABLE     �   CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);
    DROP TABLE public.jobs;
       public         heap r       postgres    false            �            1259    21161    jobs_id_seq    SEQUENCE     t   CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.jobs_id_seq;
       public               postgres    false    226                       0    0    jobs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
          public               postgres    false    225                       1259    22278    lgbts    TABLE     �   CREATE TABLE public.lgbts (
    prof_id bigint NOT NULL,
    lgbt_gender_identity character varying(255),
    lgbt_sexual_orient character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.lgbts;
       public         heap r       postgres    false                       1259    21544    members    TABLE     �   CREATE TABLE public.members (
    id bigint NOT NULL,
    member_role character varying(255) NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.members;
       public         heap r       postgres    false                       1259    21543    members_id_seq    SEQUENCE     w   CREATE SEQUENCE public.members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.members_id_seq;
       public               postgres    false    259                       0    0    members_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.members_id_seq OWNED BY public.members.id;
          public               postgres    false    258            �            1259    20577 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);
    DROP TABLE public.migrations;
       public         heap r       postgres    false            �            1259    20576    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public               postgres    false    218                       0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    217            �            1259    21280    notifications    TABLE     �  CREATE TABLE public.notifications (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    staff_id bigint,
    document_request_id bigint NOT NULL,
    notif_message text NOT NULL,
    notif_status character varying(255) DEFAULT 'unread'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    notif_title character varying(255),
    notif_date_read date,
    notif_category date
);
 !   DROP TABLE public.notifications;
       public         heap r       postgres    false            �            1259    21279    notifications_id_seq    SEQUENCE     }   CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.notifications_id_seq;
       public               postgres    false    239                       0    0    notifications_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;
          public               postgres    false    238            �            1259    21131    password_reset_tokens    TABLE     �   CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);
 )   DROP TABLE public.password_reset_tokens;
       public         heap r       postgres    false                       1259    22136    permissions    TABLE     �   CREATE TABLE public.permissions (
    id bigint NOT NULL,
    perm_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.permissions;
       public         heap r       postgres    false                       1259    22135    permissions_id_seq    SEQUENCE     {   CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.permissions_id_seq;
       public               postgres    false    277                       0    0    permissions_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;
          public               postgres    false    276            *           1259    30555    precinct_numbers    TABLE     �   CREATE TABLE public.precinct_numbers (
    id bigint NOT NULL,
    precinct_number character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 $   DROP TABLE public.precinct_numbers;
       public         heap r       postgres    false            )           1259    30554    precinct_numbers_id_seq    SEQUENCE     �   CREATE SEQUENCE public.precinct_numbers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.precinct_numbers_id_seq;
       public               postgres    false    298                       0    0    precinct_numbers_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.precinct_numbers_id_seq OWNED BY public.precinct_numbers.id;
          public               postgres    false    297            �            1259    21191    profile_vers    TABLE     x  CREATE TABLE public.profile_vers (
    id bigint NOT NULL,
    "residencyType" character varying(255),
    "blockLot" character varying(255) NOT NULL,
    street character varying(255) NOT NULL,
    sitio character varying(255),
    "yearsOfResidency" integer NOT NULL,
    barangay character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    province character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    signature_path character varying(255),
    id_image_path character varying(255),
    ticket_id character varying(255) NOT NULL
);
     DROP TABLE public.profile_vers;
       public         heap r       postgres    false            �            1259    21190    profile_vers_id_seq    SEQUENCE     |   CREATE SEQUENCE public.profile_vers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.profile_vers_id_seq;
       public               postgres    false    231                       0    0    profile_vers_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.profile_vers_id_seq OWNED BY public.profile_vers.id;
          public               postgres    false    230            �            1259    21343    profiles    TABLE     �  CREATE TABLE public.profiles (
    id bigint NOT NULL,
    prof_picture character varying(255),
    prof_mname character varying(255),
    prof_suffix character varying(255),
    prof_religion character varying(255),
    prof_cstatus character varying(255),
    prof_educattain character varying(255),
    prof_occupation character varying(255),
    prof_age integer,
    prof_start_date date,
    prof_is_4ps boolean DEFAULT false NOT NULL,
    prof_res_type character varying(255),
    house_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    prof_is_verified boolean DEFAULT false NOT NULL,
    prof_is_demog_verified boolean DEFAULT false NOT NULL,
    prof_fname character varying(255),
    prof_lname character varying(255),
    prof_gender character varying(255),
    prof_birthdate date,
    prof_is_house_head boolean DEFAULT false NOT NULL,
    prof_is_lgbt boolean DEFAULT false NOT NULL,
    prof_is_women boolean DEFAULT false NOT NULL,
    prof_is_solo_parent boolean DEFAULT false NOT NULL,
    prof_is_senior boolean DEFAULT false NOT NULL,
    prof_is_pwd boolean DEFAULT false NOT NULL,
    prof_is_children boolean DEFAULT false NOT NULL,
    prof_is_erpa boolean DEFAULT false NOT NULL
);
    DROP TABLE public.profiles;
       public         heap r       postgres    false            �            1259    21342    profiles_id_seq    SEQUENCE     x   CREATE SEQUENCE public.profiles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.profiles_id_seq;
       public               postgres    false    247                       0    0    profiles_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;
          public               postgres    false    246                       1259    22266    pwds    TABLE     �   CREATE TABLE public.pwds (
    prof_id bigint NOT NULL,
    pwd_disability character varying(255),
    pwd_fb_acc character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.pwds;
       public         heap r       postgres    false            (           1259    30533    requirements    TABLE     �   CREATE TABLE public.requirements (
    id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
     DROP TABLE public.requirements;
       public         heap r       postgres    false            '           1259    30532    requirements_id_seq    SEQUENCE     |   CREATE SEQUENCE public.requirements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.requirements_id_seq;
       public               postgres    false    296                       0    0    requirements_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.requirements_id_seq OWNED BY public.requirements.id;
          public               postgres    false    295                       1259    22143    role_permissions    TABLE     �   CREATE TABLE public.role_permissions (
    id bigint NOT NULL,
    role_id bigint NOT NULL,
    permission_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 $   DROP TABLE public.role_permissions;
       public         heap r       postgres    false                       1259    22142    role_permissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.role_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.role_permissions_id_seq;
       public               postgres    false    279                       0    0    role_permissions_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.role_permissions_id_seq OWNED BY public.role_permissions.id;
          public               postgres    false    278            �            1259    21229 
   role_users    TABLE     �   CREATE TABLE public.role_users (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    role_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.role_users;
       public         heap r       postgres    false            �            1259    21228    role_user_id_seq    SEQUENCE     y   CREATE SEQUENCE public.role_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.role_user_id_seq;
       public               postgres    false    237                       0    0    role_user_id_seq    SEQUENCE OWNED BY     F   ALTER SEQUENCE public.role_user_id_seq OWNED BY public.role_users.id;
          public               postgres    false    236            �            1259    21220    roles    TABLE     �   CREATE TABLE public.roles (
    id bigint NOT NULL,
    role_name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    role_descr text
);
    DROP TABLE public.roles;
       public         heap r       postgres    false            �            1259    21219    roles_id_seq    SEQUENCE     u   CREATE SEQUENCE public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public               postgres    false    235                       0    0    roles_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
          public               postgres    false    234            $           1259    23068    sectoral_forms    TABLE     ;  CREATE TABLE public.sectoral_forms (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(255),
    addtl_detail text,
    image character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
 "   DROP TABLE public.sectoral_forms;
       public         heap r       postgres    false            #           1259    23067    sectoral_forms_id_seq    SEQUENCE     ~   CREATE SEQUENCE public.sectoral_forms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ,   DROP SEQUENCE public.sectoral_forms_id_seq;
       public               postgres    false    292                       0    0    sectoral_forms_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public.sectoral_forms_id_seq OWNED BY public.sectoral_forms.id;
          public               postgres    false    291            %           1259    23076    sectoral_requirements    TABLE     �   CREATE TABLE public.sectoral_requirements (
    form_id bigint NOT NULL,
    requirement text NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    id bigint NOT NULL
);
 )   DROP TABLE public.sectoral_requirements;
       public         heap r       postgres    false            &           1259    30522    sectoral_requirements_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sectoral_requirements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.sectoral_requirements_id_seq;
       public               postgres    false    293                       0    0    sectoral_requirements_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.sectoral_requirements_id_seq OWNED BY public.sectoral_requirements.id;
          public               postgres    false    294                       1259    22314    seniors    TABLE     �  CREATE TABLE public.seniors (
    prof_id bigint NOT NULL,
    snr_ref_code character varying(50),
    snr_ethnic_origin character varying(50),
    snr_dialect character varying(50),
    snr_osca_id_num character varying(50),
    snr_gsis_sss character varying(50),
    snr_tin character varying(50),
    snr_philhealth character varying(50),
    snr_sc_association_id_num character varying(50),
    snr_other_govt_id character varying(50),
    snr_capability_to_travel boolean DEFAULT false NOT NULL,
    snr_svc_biz_emp boolean DEFAULT false NOT NULL,
    snr_cur_pension numeric(10,2),
    snr_area_of_specialization text,
    snr_share_skill text,
    snr_comm_serv_involve boolean DEFAULT false NOT NULL,
    snr_residing_with text,
    snr_src_of_inc text,
    snr_immovable_asset text,
    snr_movable_asset text,
    snr_monthly_inc numeric(10,2),
    snr_problem_need text,
    snr_medic_concern text,
    snr_dental_concern text,
    snr_optical text,
    snr_hearing text,
    snr_social_emotional text,
    snr_medic_maintenance text,
    snr_diff text,
    snr_has_medical_checkup boolean DEFAULT false NOT NULL,
    snr_medical_checkup_date date,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.seniors;
       public         heap r       postgres    false            �            1259    21138    sessions    TABLE     �   CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);
    DROP TABLE public.sessions;
       public         heap r       postgres    false                        1259    23037    sign_up_requests    TABLE     �  CREATE TABLE public.sign_up_requests (
    id bigint NOT NULL,
    sign_up_fname character varying(255),
    sign_up_lname character varying(255),
    sign_up_birthdate date,
    sign_up_email character varying(255),
    sign_up_password character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    sign_up_gender character varying(10),
    sign_up_cstatus character varying(10),
    sign_up_is_voter boolean DEFAULT false NOT NULL
);
 $   DROP TABLE public.sign_up_requests;
       public         heap r       postgres    false                       1259    23036    sign_up_requests_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sign_up_requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.sign_up_requests_id_seq;
       public               postgres    false    288                       0    0    sign_up_requests_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.sign_up_requests_id_seq OWNED BY public.sign_up_requests.id;
          public               postgres    false    287                       1259    22302    solo_parents    TABLE     �  CREATE TABLE public.solo_parents (
    prof_id bigint NOT NULL,
    solo_mon_income numeric(10,2),
    solo_tot_mon_inc numeric(10,2),
    solo_classi text,
    solo_prob text,
    solo_resource text,
    solo_parent_circumstance text,
    solo_parent_needs text,
    solo_parent_fam_rscrs text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
     DROP TABLE public.solo_parents;
       public         heap r       postgres    false                       1259    21654    temp_submissions    TABLE       CREATE TABLE public.temp_submissions (
    id bigint NOT NULL,
    profile_id bigint NOT NULL,
    data json NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    signature character varying(255),
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    form_id bigint,
    CONSTRAINT temp_submissions_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);
 $   DROP TABLE public.temp_submissions;
       public         heap r       postgres    false                       1259    21653    temp_submissions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.temp_submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.temp_submissions_id_seq;
       public               postgres    false    269                       0    0    temp_submissions_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.temp_submissions_id_seq OWNED BY public.temp_submissions.id;
          public               postgres    false    268            �            1259    21121    users    TABLE       CREATE TABLE public.users (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    user_uname character varying(255),
    user_contact character varying(255),
    user_status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    prof_id bigint
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    21120    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    220                        0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    219            "           1259    23048    voters    TABLE     A  CREATE TABLE public.voters (
    id bigint NOT NULL,
    vote_fname character varying(255),
    vote_lname character varying(255),
    bar_id bigint,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    vote_precinct character varying(255) NOT NULL,
    precinct_id bigint
);
    DROP TABLE public.voters;
       public         heap r       postgres    false            !           1259    23047    voters_id_seq    SEQUENCE     v   CREATE SEQUENCE public.voters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.voters_id_seq;
       public               postgres    false    290            !           0    0    voters_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.voters_id_seq OWNED BY public.voters.id;
          public               postgres    false    289                       1259    22255    womens    TABLE     �   CREATE TABLE public.womens (
    prof_id bigint NOT NULL,
    women_is_breadwinner boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.womens;
       public         heap r       postgres    false            @           2604    21323    activity_logs id    DEFAULT     t   ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);
 ?   ALTER TABLE public.activity_logs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    243    242    243            O           2604    21380    addresses id    DEFAULT     l   ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);
 ;   ALTER TABLE public.addresses ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    251    250    251            8           2604    21203    announcements id    DEFAULT     t   ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);
 ?   ALTER TABLE public.announcements ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    233    232    233            Y           2604    21584    attachments id    DEFAULT     p   ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);
 =   ALTER TABLE public.attachments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    263    262    263            [           2604    21612    barangay_officials id    DEFAULT     ~   ALTER TABLE ONLY public.barangay_officials ALTER COLUMN id SET DEFAULT nextval('public.barangay_officials_id_seq'::regclass);
 D   ALTER TABLE public.barangay_officials ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    266    267    267            P           2604    21404    barangays id    DEFAULT     l   ALTER TABLE ONLY public.barangays ALTER COLUMN id SET DEFAULT nextval('public.barangays_id_seq'::regclass);
 ;   ALTER TABLE public.barangays ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    252    253    253            X           2604    21567    committee_members id    DEFAULT     |   ALTER TABLE ONLY public.committee_members ALTER COLUMN id SET DEFAULT nextval('public.committee_members_id_seq'::regclass);
 C   ALTER TABLE public.committee_members ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    261    260    261            S           2604    21517    committees id    DEFAULT     n   ALTER TABLE ONLY public.committees ALTER COLUMN id SET DEFAULT nextval('public.committees_id_seq'::regclass);
 <   ALTER TABLE public.committees ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    255    254    255            Z           2604    21598    complaint_status_histories id    DEFAULT     �   ALTER TABLE ONLY public.complaint_status_histories ALTER COLUMN id SET DEFAULT nextval('public.complaint_status_histories_id_seq'::regclass);
 L   ALTER TABLE public.complaint_status_histories ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    265    264    265            T           2604    21526    complaints id    DEFAULT     n   ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);
 <   ALTER TABLE public.complaints ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    257    256    257            `           2604    21725    document_requests id    DEFAULT     |   ALTER TABLE ONLY public.document_requests ALTER COLUMN id SET DEFAULT nextval('public.document_requests_id_seq'::regclass);
 C   ALTER TABLE public.document_requests ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    272    273    273            N           2604    21366    emergency_contacts id    DEFAULT     ~   ALTER TABLE ONLY public.emergency_contacts ALTER COLUMN id SET DEFAULT nextval('public.emergency_contacts_id_seq'::regclass);
 D   ALTER TABLE public.emergency_contacts ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    249    248    249            5           2604    21182    failed_jobs id    DEFAULT     p   ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);
 =   ALTER TABLE public.failed_jobs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228    229            >           2604    21308    feedbacks id    DEFAULT     l   ALTER TABLE ONLY public.feedbacks ALTER COLUMN id SET DEFAULT nextval('public.feedbacks_id_seq'::regclass);
 ;   ALTER TABLE public.feedbacks ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    240    241    241            ^           2604    21687    household_join_requests id    DEFAULT     �   ALTER TABLE ONLY public.household_join_requests ALTER COLUMN id SET DEFAULT nextval('public.household_join_requests_id_seq'::regclass);
 I   ALTER TABLE public.household_join_requests ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    270    271    271            c           2604    22117    household_members id    DEFAULT     |   ALTER TABLE ONLY public.household_members ALTER COLUMN id SET DEFAULT nextval('public.household_members_id_seq'::regclass);
 C   ALTER TABLE public.household_members ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    275    274    275            A           2604    21337    households id    DEFAULT     n   ALTER TABLE ONLY public.households ALTER COLUMN id SET DEFAULT nextval('public.households_id_seq'::regclass);
 <   ALTER TABLE public.households ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    245    244    245            4           2604    21165    jobs id    DEFAULT     b   ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
 6   ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    225    226            W           2604    21547 
   members id    DEFAULT     h   ALTER TABLE ONLY public.members ALTER COLUMN id SET DEFAULT nextval('public.members_id_seq'::regclass);
 9   ALTER TABLE public.members ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    259    258    259            1           2604    20580    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            <           2604    21283    notifications id    DEFAULT     t   ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);
 ?   ALTER TABLE public.notifications ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    238    239    239            g           2604    22139    permissions id    DEFAULT     p   ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);
 =   ALTER TABLE public.permissions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    277    276    277            t           2604    30558    precinct_numbers id    DEFAULT     z   ALTER TABLE ONLY public.precinct_numbers ALTER COLUMN id SET DEFAULT nextval('public.precinct_numbers_id_seq'::regclass);
 B   ALTER TABLE public.precinct_numbers ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    298    297    298            7           2604    21194    profile_vers id    DEFAULT     r   ALTER TABLE ONLY public.profile_vers ALTER COLUMN id SET DEFAULT nextval('public.profile_vers_id_seq'::regclass);
 >   ALTER TABLE public.profile_vers ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    231    230    231            B           2604    21346    profiles id    DEFAULT     j   ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);
 :   ALTER TABLE public.profiles ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    246    247    247            s           2604    30536    requirements id    DEFAULT     r   ALTER TABLE ONLY public.requirements ALTER COLUMN id SET DEFAULT nextval('public.requirements_id_seq'::regclass);
 >   ALTER TABLE public.requirements ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    295    296    296            h           2604    22146    role_permissions id    DEFAULT     z   ALTER TABLE ONLY public.role_permissions ALTER COLUMN id SET DEFAULT nextval('public.role_permissions_id_seq'::regclass);
 B   ALTER TABLE public.role_permissions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    278    279    279            ;           2604    21232    role_users id    DEFAULT     m   ALTER TABLE ONLY public.role_users ALTER COLUMN id SET DEFAULT nextval('public.role_user_id_seq'::regclass);
 <   ALTER TABLE public.role_users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    237    236    237            :           2604    21223    roles id    DEFAULT     d   ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 7   ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    234    235    235            q           2604    23071    sectoral_forms id    DEFAULT     v   ALTER TABLE ONLY public.sectoral_forms ALTER COLUMN id SET DEFAULT nextval('public.sectoral_forms_id_seq'::regclass);
 @   ALTER TABLE public.sectoral_forms ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    291    292    292            r           2604    30523    sectoral_requirements id    DEFAULT     �   ALTER TABLE ONLY public.sectoral_requirements ALTER COLUMN id SET DEFAULT nextval('public.sectoral_requirements_id_seq'::regclass);
 G   ALTER TABLE public.sectoral_requirements ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    294    293            n           2604    23040    sign_up_requests id    DEFAULT     z   ALTER TABLE ONLY public.sign_up_requests ALTER COLUMN id SET DEFAULT nextval('public.sign_up_requests_id_seq'::regclass);
 B   ALTER TABLE public.sign_up_requests ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    288    287    288            \           2604    21657    temp_submissions id    DEFAULT     z   ALTER TABLE ONLY public.temp_submissions ALTER COLUMN id SET DEFAULT nextval('public.temp_submissions_id_seq'::regclass);
 B   ALTER TABLE public.temp_submissions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    269    268    269            2           2604    21124    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220            p           2604    23051 	   voters id    DEFAULT     f   ALTER TABLE ONLY public.voters ALTER COLUMN id SET DEFAULT nextval('public.voters_id_seq'::regclass);
 8   ALTER TABLE public.voters ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    289    290    290            �          0    21320    activity_logs 
   TABLE DATA           q   COPY public.activity_logs (id, log_action, log_table, log_table_id, user_id, created_at, updated_at) FROM stdin;
    public               postgres    false    243   s�      �          0    21377 	   addresses 
   TABLE DATA           �   COPY public.addresses (id, addr_city, addr_barangay, addr_region, addr_block, addr_sitio, addr_street, addr_houseno, addr_province, addr_type, house_id, emerg_id, prof_id, created_at, updated_at) FROM stdin;
    public               postgres    false    251   ��      �          0    21200    announcements 
   TABLE DATA           �   COPY public.announcements (id, user_id, title, content, slug, publish_at, is_published, created_at, updated_at, picture) FROM stdin;
    public               postgres    false    233   �      �          0    21581    attachments 
   TABLE DATA           �   COPY public.attachments (id, comp_id, attach_path, attach_type, created_at, updated_at, prof_id, attach_src, attach_name, sign_up_id, form_id) FROM stdin;
    public               postgres    false    263   ��      �          0    21609    barangay_officials 
   TABLE DATA           �   COPY public.barangay_officials (id, bar_off_position, bar_off_term_st, bar_off_term_end, bar_off_status, bar_id, prof_id, created_at, updated_at) FROM stdin;
    public               postgres    false    267   �      �          0    21401 	   barangays 
   TABLE DATA           (  COPY public.barangays (id, bar_name, bar_gmaplink, municipal_or_city, bar_prov, bar_contact, bar_email, bar_fb_link, bar_stday, bar_endday, bar_sthour, bar_endhour, created_at, updated_at, bar_logo, bar_motto, bar_systname, bar_vision, bar_mission, bar_value, facebook, bar_location) FROM stdin;
    public               postgres    false    253   Q�      �          0    21147    cache 
   TABLE DATA           7   COPY public.cache (key, value, expiration) FROM stdin;
    public               postgres    false    223   .�      �          0    21154    cache_locks 
   TABLE DATA           =   COPY public.cache_locks (key, owner, expiration) FROM stdin;
    public               postgres    false    224   ��      �          0    22245 	   childrens 
   TABLE DATA           R   COPY public.childrens (prof_id, child_parent, created_at, updated_at) FROM stdin;
    public               postgres    false    280   ��      �          0    21564    committee_members 
   TABLE DATA           q   COPY public.committee_members (id, com_id, member_id, com_mem_assigned_date, created_at, updated_at) FROM stdin;
    public               postgres    false    261   ��      �          0    21514 
   committees 
   TABLE DATA           [   COPY public.committees (id, com_name, com_description, created_at, updated_at) FROM stdin;
    public               postgres    false    255    �      �          0    21595    complaint_status_histories 
   TABLE DATA           |   COPY public.complaint_status_histories (id, comp_id, comp_hist_status, comp_hist_notes, created_at, updated_at) FROM stdin;
    public               postgres    false    265   ��      �          0    21523 
   complaints 
   TABLE DATA           �   COPY public.complaints (id, comp_title, comp_description, comp_location, comp_status, comp_priority_level, comp_resol_details, comp_resolution_date, user_id, com_id, created_at, updated_at) FROM stdin;
    public               postgres    false    257   	�      �          0    21722    document_requests 
   TABLE DATA           �   COPY public.document_requests (id, user_id, name, address, age, block, civil_status, copies, purpose, status, document_type, staff_id, created_at, updated_at, requester_name, requester_email, requester_contact) FROM stdin;
    public               postgres    false    273   &�      �          0    21363    emergency_contacts 
   TABLE DATA           �   COPY public.emergency_contacts (id, emerg_fname, emerg_lname, emerg_relation, emerg_contact, emerg_cstatus, emerg_educattain, emerg_occupation, emerg_restype, prof_id, created_at, updated_at) FROM stdin;
    public               postgres    false    249   ��      �          0    22290    erpas 
   TABLE DATA           �   COPY public.erpas (prof_id, erpa_tal, erpa_hobb, erpa_other_skill, erpa_school, erpa_civic, erpa_community, erpa_workplace, erpa_seminar_title, erpa_seminar_date, erpa_seminar_organizer, created_at, updated_at) FROM stdin;
    public               postgres    false    284   ��      �          0    21179    failed_jobs 
   TABLE DATA           a   COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
    public               postgres    false    229   �      �          0    21305 	   feedbacks 
   TABLE DATA           t   COPY public.feedbacks (id, feed_title, feed_message, feed_submit_date, user_id, created_at, updated_at) FROM stdin;
    public               postgres    false    241   �      �          0    21684    household_join_requests 
   TABLE DATA           p   COPY public.household_join_requests (id, user_id, house_id, house_j_status, created_at, updated_at) FROM stdin;
    public               postgres    false    271   ;�      �          0    22114    household_members 
   TABLE DATA           �   COPY public.household_members (id, hmemb_relation, hmemb_is_primary_contact, hmemb_working_status, hmemb_is_dependent, hmemb_is_guardian, house_id, prof_id, created_at, updated_at) FROM stdin;
    public               postgres    false    275   X�      �          0    21334 
   households 
   TABLE DATA           �   COPY public.households (id, house_name, house_util_access, created_at, updated_at, house_type, house_ownership, house_year) FROM stdin;
    public               postgres    false    245   u�      �          0    21171    job_batches 
   TABLE DATA           �   COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
    public               postgres    false    227   ��      �          0    21162    jobs 
   TABLE DATA           c   COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
    public               postgres    false    226   �      �          0    22278    lgbts 
   TABLE DATA           j   COPY public.lgbts (prof_id, lgbt_gender_identity, lgbt_sexual_orient, created_at, updated_at) FROM stdin;
    public               postgres    false    283   -�      �          0    21544    members 
   TABLE DATA           S   COPY public.members (id, member_role, user_id, created_at, updated_at) FROM stdin;
    public               postgres    false    259   J�      �          0    20577 
   migrations 
   TABLE DATA           :   COPY public.migrations (id, migration, batch) FROM stdin;
    public               postgres    false    218   g�      �          0    21280    notifications 
   TABLE DATA           �   COPY public.notifications (id, user_id, staff_id, document_request_id, notif_message, notif_status, created_at, updated_at, notif_title, notif_date_read, notif_category) FROM stdin;
    public               postgres    false    239   ��      �          0    21131    password_reset_tokens 
   TABLE DATA           I   COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
    public               postgres    false    221   �      �          0    22136    permissions 
   TABLE DATA           L   COPY public.permissions (id, perm_name, created_at, updated_at) FROM stdin;
    public               postgres    false    277   +�      �          0    30555    precinct_numbers 
   TABLE DATA           W   COPY public.precinct_numbers (id, precinct_number, created_at, updated_at) FROM stdin;
    public               postgres    false    298   H�      �          0    21191    profile_vers 
   TABLE DATA           �   COPY public.profile_vers (id, "residencyType", "blockLot", street, sitio, "yearsOfResidency", barangay, city, province, created_at, updated_at, signature_path, id_image_path, ticket_id) FROM stdin;
    public               postgres    false    231   e�      �          0    21343    profiles 
   TABLE DATA           �  COPY public.profiles (id, prof_picture, prof_mname, prof_suffix, prof_religion, prof_cstatus, prof_educattain, prof_occupation, prof_age, prof_start_date, prof_is_4ps, prof_res_type, house_id, created_at, updated_at, prof_is_verified, prof_is_demog_verified, prof_fname, prof_lname, prof_gender, prof_birthdate, prof_is_house_head, prof_is_lgbt, prof_is_women, prof_is_solo_parent, prof_is_senior, prof_is_pwd, prof_is_children, prof_is_erpa) FROM stdin;
    public               postgres    false    247   ��      �          0    22266    pwds 
   TABLE DATA           [   COPY public.pwds (prof_id, pwd_disability, pwd_fb_acc, created_at, updated_at) FROM stdin;
    public               postgres    false    282   ,�      �          0    30533    requirements 
   TABLE DATA           B   COPY public.requirements (id, created_at, updated_at) FROM stdin;
    public               postgres    false    296   I�      �          0    22143    role_permissions 
   TABLE DATA           ^   COPY public.role_permissions (id, role_id, permission_id, created_at, updated_at) FROM stdin;
    public               postgres    false    279   f�      �          0    21229 
   role_users 
   TABLE DATA           R   COPY public.role_users (id, user_id, role_id, created_at, updated_at) FROM stdin;
    public               postgres    false    237   ��      �          0    21220    roles 
   TABLE DATA           R   COPY public.roles (id, role_name, created_at, updated_at, role_descr) FROM stdin;
    public               postgres    false    235   ��      �          0    23068    sectoral_forms 
   TABLE DATA           v   COPY public.sectoral_forms (id, name, description, category, addtl_detail, image, created_at, updated_at) FROM stdin;
    public               postgres    false    292   ��      �          0    23076    sectoral_requirements 
   TABLE DATA           a   COPY public.sectoral_requirements (form_id, requirement, created_at, updated_at, id) FROM stdin;
    public               postgres    false    293   �      �          0    22314    seniors 
   TABLE DATA           o  COPY public.seniors (prof_id, snr_ref_code, snr_ethnic_origin, snr_dialect, snr_osca_id_num, snr_gsis_sss, snr_tin, snr_philhealth, snr_sc_association_id_num, snr_other_govt_id, snr_capability_to_travel, snr_svc_biz_emp, snr_cur_pension, snr_area_of_specialization, snr_share_skill, snr_comm_serv_involve, snr_residing_with, snr_src_of_inc, snr_immovable_asset, snr_movable_asset, snr_monthly_inc, snr_problem_need, snr_medic_concern, snr_dental_concern, snr_optical, snr_hearing, snr_social_emotional, snr_medic_maintenance, snr_diff, snr_has_medical_checkup, snr_medical_checkup_date, created_at, updated_at) FROM stdin;
    public               postgres    false    286   ��      �          0    21138    sessions 
   TABLE DATA           _   COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
    public               postgres    false    222   ��      �          0    23037    sign_up_requests 
   TABLE DATA           �   COPY public.sign_up_requests (id, sign_up_fname, sign_up_lname, sign_up_birthdate, sign_up_email, sign_up_password, created_at, updated_at, sign_up_gender, sign_up_cstatus, sign_up_is_voter) FROM stdin;
    public               postgres    false    288   ��      �          0    22302    solo_parents 
   TABLE DATA           �   COPY public.solo_parents (prof_id, solo_mon_income, solo_tot_mon_inc, solo_classi, solo_prob, solo_resource, solo_parent_circumstance, solo_parent_needs, solo_parent_fam_rscrs, created_at, updated_at) FROM stdin;
    public               postgres    false    285   ��      �          0    21654    temp_submissions 
   TABLE DATA           t   COPY public.temp_submissions (id, profile_id, data, created_at, updated_at, signature, status, form_id) FROM stdin;
    public               postgres    false    269   ��      �          0    21121    users 
   TABLE DATA           �   COPY public.users (id, email, email_verified_at, password, remember_token, created_at, updated_at, user_uname, user_contact, user_status, prof_id) FROM stdin;
    public               postgres    false    220   ��      �          0    23048    voters 
   TABLE DATA           x   COPY public.voters (id, vote_fname, vote_lname, bar_id, created_at, updated_at, vote_precinct, precinct_id) FROM stdin;
    public               postgres    false    290   1�      �          0    22255    womens 
   TABLE DATA           W   COPY public.womens (prof_id, women_is_breadwinner, created_at, updated_at) FROM stdin;
    public               postgres    false    281   N�      "           0    0    activity_logs_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.activity_logs_id_seq', 131, true);
          public               postgres    false    242            #           0    0    addresses_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.addresses_id_seq', 7, true);
          public               postgres    false    250            $           0    0    announcements_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.announcements_id_seq', 15, true);
          public               postgres    false    232            %           0    0    attachments_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.attachments_id_seq', 17, true);
          public               postgres    false    262            &           0    0    barangay_officials_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.barangay_officials_id_seq', 1, true);
          public               postgres    false    266            '           0    0    barangays_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.barangays_id_seq', 1, true);
          public               postgres    false    252            (           0    0    committee_members_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.committee_members_id_seq', 2, true);
          public               postgres    false    260            )           0    0    committees_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.committees_id_seq', 9, true);
          public               postgres    false    254            *           0    0 !   complaint_status_histories_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.complaint_status_histories_id_seq', 1, false);
          public               postgres    false    264            +           0    0    complaints_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.complaints_id_seq', 1, false);
          public               postgres    false    256            ,           0    0    document_requests_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.document_requests_id_seq', 11, true);
          public               postgres    false    272            -           0    0    emergency_contacts_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.emergency_contacts_id_seq', 1, false);
          public               postgres    false    248            .           0    0    failed_jobs_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);
          public               postgres    false    228            /           0    0    feedbacks_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.feedbacks_id_seq', 1, false);
          public               postgres    false    240            0           0    0    household_join_requests_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.household_join_requests_id_seq', 1, false);
          public               postgres    false    270            1           0    0    household_members_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.household_members_id_seq', 1, false);
          public               postgres    false    274            2           0    0    households_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.households_id_seq', 3, true);
          public               postgres    false    244            3           0    0    jobs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);
          public               postgres    false    225            4           0    0    members_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.members_id_seq', 3, true);
          public               postgres    false    258            5           0    0    migrations_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.migrations_id_seq', 111, true);
          public               postgres    false    217            6           0    0    notifications_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);
          public               postgres    false    238            7           0    0    permissions_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.permissions_id_seq', 1, false);
          public               postgres    false    276            8           0    0    precinct_numbers_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.precinct_numbers_id_seq', 1, false);
          public               postgres    false    297            9           0    0    profile_vers_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.profile_vers_id_seq', 10, true);
          public               postgres    false    230            :           0    0    profiles_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.profiles_id_seq', 20, true);
          public               postgres    false    246            ;           0    0    requirements_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.requirements_id_seq', 1, false);
          public               postgres    false    295            <           0    0    role_permissions_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.role_permissions_id_seq', 1, false);
          public               postgres    false    278            =           0    0    role_user_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.role_user_id_seq', 1, false);
          public               postgres    false    236            >           0    0    roles_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.roles_id_seq', 1, false);
          public               postgres    false    234            ?           0    0    sectoral_forms_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.sectoral_forms_id_seq', 7, true);
          public               postgres    false    291            @           0    0    sectoral_requirements_id_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('public.sectoral_requirements_id_seq', 21, true);
          public               postgres    false    294            A           0    0    sign_up_requests_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.sign_up_requests_id_seq', 4, true);
          public               postgres    false    287            B           0    0    temp_submissions_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.temp_submissions_id_seq', 1, true);
          public               postgres    false    268            C           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 20, true);
          public               postgres    false    219            D           0    0    voters_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.voters_id_seq', 1, false);
          public               postgres    false    289            �           2606    21327     activity_logs activity_logs_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.activity_logs DROP CONSTRAINT activity_logs_pkey;
       public                 postgres    false    243            �           2606    21384    addresses addresses_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.addresses DROP CONSTRAINT addresses_pkey;
       public                 postgres    false    251            �           2606    21208     announcements announcements_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.announcements DROP CONSTRAINT announcements_pkey;
       public                 postgres    false    233            �           2606    21217 '   announcements announcements_slug_unique 
   CONSTRAINT     b   ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_slug_unique UNIQUE (slug);
 Q   ALTER TABLE ONLY public.announcements DROP CONSTRAINT announcements_slug_unique;
       public                 postgres    false    233            �           2606    21588    attachments attachments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_pkey;
       public                 postgres    false    263            �           2606    21616 *   barangay_officials barangay_officials_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.barangay_officials
    ADD CONSTRAINT barangay_officials_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.barangay_officials DROP CONSTRAINT barangay_officials_pkey;
       public                 postgres    false    267            �           2606    21411    barangays barangays_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.barangays
    ADD CONSTRAINT barangays_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.barangays DROP CONSTRAINT barangays_pkey;
       public                 postgres    false    253            �           2606    21160    cache_locks cache_locks_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);
 F   ALTER TABLE ONLY public.cache_locks DROP CONSTRAINT cache_locks_pkey;
       public                 postgres    false    224            �           2606    21153    cache cache_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);
 :   ALTER TABLE ONLY public.cache DROP CONSTRAINT cache_pkey;
       public                 postgres    false    223            �           2606    22254    childrens childrens_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.childrens
    ADD CONSTRAINT childrens_pkey PRIMARY KEY (prof_id);
 B   ALTER TABLE ONLY public.childrens DROP CONSTRAINT childrens_pkey;
       public                 postgres    false    280            �           2606    21569 (   committee_members committee_members_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.committee_members
    ADD CONSTRAINT committee_members_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.committee_members DROP CONSTRAINT committee_members_pkey;
       public                 postgres    false    261            �           2606    21521    committees committees_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.committees
    ADD CONSTRAINT committees_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.committees DROP CONSTRAINT committees_pkey;
       public                 postgres    false    255            �           2606    21602 :   complaint_status_histories complaint_status_histories_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public.complaint_status_histories
    ADD CONSTRAINT complaint_status_histories_pkey PRIMARY KEY (id);
 d   ALTER TABLE ONLY public.complaint_status_histories DROP CONSTRAINT complaint_status_histories_pkey;
       public                 postgres    false    265            �           2606    21532    complaints complaints_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_pkey;
       public                 postgres    false    257            �           2606    21731 (   document_requests document_requests_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT document_requests_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.document_requests DROP CONSTRAINT document_requests_pkey;
       public                 postgres    false    273            �           2606    21370 *   emergency_contacts emergency_contacts_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.emergency_contacts DROP CONSTRAINT emergency_contacts_pkey;
       public                 postgres    false    249            �           2606    22301    erpas erpas_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.erpas
    ADD CONSTRAINT erpas_pkey PRIMARY KEY (prof_id);
 :   ALTER TABLE ONLY public.erpas DROP CONSTRAINT erpas_pkey;
       public                 postgres    false    284            �           2606    21187    failed_jobs failed_jobs_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_pkey;
       public                 postgres    false    229            �           2606    21189 #   failed_jobs failed_jobs_uuid_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);
 M   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_uuid_unique;
       public                 postgres    false    229            �           2606    21313    feedbacks feedbacks_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.feedbacks DROP CONSTRAINT feedbacks_pkey;
       public                 postgres    false    241            �           2606    21690 4   household_join_requests household_join_requests_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.household_join_requests
    ADD CONSTRAINT household_join_requests_pkey PRIMARY KEY (id);
 ^   ALTER TABLE ONLY public.household_join_requests DROP CONSTRAINT household_join_requests_pkey;
       public                 postgres    false    271            �           2606    22124 (   household_members household_members_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.household_members DROP CONSTRAINT household_members_pkey;
       public                 postgres    false    275            �           2606    21341    households households_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.households
    ADD CONSTRAINT households_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.households DROP CONSTRAINT households_pkey;
       public                 postgres    false    245            �           2606    21177    job_batches job_batches_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.job_batches DROP CONSTRAINT job_batches_pkey;
       public                 postgres    false    227            �           2606    21169    jobs jobs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public                 postgres    false    226            �           2606    22289    lgbts lgbts_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.lgbts
    ADD CONSTRAINT lgbts_pkey PRIMARY KEY (prof_id);
 :   ALTER TABLE ONLY public.lgbts DROP CONSTRAINT lgbts_pkey;
       public                 postgres    false    283            �           2606    21549    members members_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.members DROP CONSTRAINT members_pkey;
       public                 postgres    false    259            w           2606    20582    migrations migrations_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.migrations DROP CONSTRAINT migrations_pkey;
       public                 postgres    false    218            �           2606    21288     notifications notifications_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_pkey;
       public                 postgres    false    239                       2606    21137 0   password_reset_tokens password_reset_tokens_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);
 Z   ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_pkey;
       public                 postgres    false    221            �           2606    22141    permissions permissions_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.permissions DROP CONSTRAINT permissions_pkey;
       public                 postgres    false    277            �           2606    30560 &   precinct_numbers precinct_numbers_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.precinct_numbers
    ADD CONSTRAINT precinct_numbers_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.precinct_numbers DROP CONSTRAINT precinct_numbers_pkey;
       public                 postgres    false    298            �           2606    30562 8   precinct_numbers precinct_numbers_precinct_number_unique 
   CONSTRAINT     ~   ALTER TABLE ONLY public.precinct_numbers
    ADD CONSTRAINT precinct_numbers_precinct_number_unique UNIQUE (precinct_number);
 b   ALTER TABLE ONLY public.precinct_numbers DROP CONSTRAINT precinct_numbers_precinct_number_unique;
       public                 postgres    false    298            �           2606    21198    profile_vers profile_vers_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.profile_vers
    ADD CONSTRAINT profile_vers_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.profile_vers DROP CONSTRAINT profile_vers_pkey;
       public                 postgres    false    231            �           2606    21808 *   profile_vers profile_vers_ticket_id_unique 
   CONSTRAINT     j   ALTER TABLE ONLY public.profile_vers
    ADD CONSTRAINT profile_vers_ticket_id_unique UNIQUE (ticket_id);
 T   ALTER TABLE ONLY public.profile_vers DROP CONSTRAINT profile_vers_ticket_id_unique;
       public                 postgres    false    231            �           2606    21351    profiles profiles_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_pkey;
       public                 postgres    false    247            �           2606    22277    pwds pwds_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.pwds
    ADD CONSTRAINT pwds_pkey PRIMARY KEY (prof_id);
 8   ALTER TABLE ONLY public.pwds DROP CONSTRAINT pwds_pkey;
       public                 postgres    false    282            �           2606    30538    requirements requirements_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.requirements
    ADD CONSTRAINT requirements_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.requirements DROP CONSTRAINT requirements_pkey;
       public                 postgres    false    296            �           2606    22148 &   role_permissions role_permissions_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.role_permissions DROP CONSTRAINT role_permissions_pkey;
       public                 postgres    false    279            �           2606    21234    role_users role_user_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.role_users
    ADD CONSTRAINT role_user_pkey PRIMARY KEY (id);
 C   ALTER TABLE ONLY public.role_users DROP CONSTRAINT role_user_pkey;
       public                 postgres    false    237            �           2606    21227    roles roles_name_unique 
   CONSTRAINT     W   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_unique UNIQUE (role_name);
 A   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_name_unique;
       public                 postgres    false    235            �           2606    21225    roles roles_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public                 postgres    false    235            �           2606    23075 "   sectoral_forms sectoral_forms_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.sectoral_forms
    ADD CONSTRAINT sectoral_forms_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.sectoral_forms DROP CONSTRAINT sectoral_forms_pkey;
       public                 postgres    false    292            �           2606    30525 0   sectoral_requirements sectoral_requirements_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.sectoral_requirements
    ADD CONSTRAINT sectoral_requirements_pkey PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.sectoral_requirements DROP CONSTRAINT sectoral_requirements_pkey;
       public                 postgres    false    293            �           2606    22329    seniors seniors_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.seniors
    ADD CONSTRAINT seniors_pkey PRIMARY KEY (prof_id);
 >   ALTER TABLE ONLY public.seniors DROP CONSTRAINT seniors_pkey;
       public                 postgres    false    286            �           2606    21144    sessions sessions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public                 postgres    false    222            �           2606    23044 &   sign_up_requests sign_up_requests_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.sign_up_requests
    ADD CONSTRAINT sign_up_requests_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.sign_up_requests DROP CONSTRAINT sign_up_requests_pkey;
       public                 postgres    false    288            �           2606    23046 6   sign_up_requests sign_up_requests_sign_up_email_unique 
   CONSTRAINT     z   ALTER TABLE ONLY public.sign_up_requests
    ADD CONSTRAINT sign_up_requests_sign_up_email_unique UNIQUE (sign_up_email);
 `   ALTER TABLE ONLY public.sign_up_requests DROP CONSTRAINT sign_up_requests_sign_up_email_unique;
       public                 postgres    false    288            �           2606    22313    solo_parents solo_parents_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.solo_parents
    ADD CONSTRAINT solo_parents_pkey PRIMARY KEY (prof_id);
 H   ALTER TABLE ONLY public.solo_parents DROP CONSTRAINT solo_parents_pkey;
       public                 postgres    false    285            �           2606    21661 &   temp_submissions temp_submissions_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.temp_submissions
    ADD CONSTRAINT temp_submissions_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.temp_submissions DROP CONSTRAINT temp_submissions_pkey;
       public                 postgres    false    269            y           2606    21130    users users_email_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
       public                 postgres    false    220            {           2606    21128    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            }           2606    21453    users users_user_uname_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_user_uname_unique UNIQUE (user_uname);
 G   ALTER TABLE ONLY public.users DROP CONSTRAINT users_user_uname_unique;
       public                 postgres    false    220            �           2606    23055    voters voters_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.voters
    ADD CONSTRAINT voters_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.voters DROP CONSTRAINT voters_pkey;
       public                 postgres    false    290            �           2606    22265    womens womens_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.womens
    ADD CONSTRAINT womens_pkey PRIMARY KEY (prof_id);
 <   ALTER TABLE ONLY public.womens DROP CONSTRAINT womens_pkey;
       public                 postgres    false    281            �           1259    21215    announcements_created_at_index    INDEX     ^   CREATE INDEX announcements_created_at_index ON public.announcements USING btree (created_at);
 2   DROP INDEX public.announcements_created_at_index;
       public                 postgres    false    233            �           1259    21214    announcements_user_id_index    INDEX     X   CREATE INDEX announcements_user_id_index ON public.announcements USING btree (user_id);
 /   DROP INDEX public.announcements_user_id_index;
       public                 postgres    false    233            �           1259    21170    jobs_queue_index    INDEX     B   CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);
 $   DROP INDEX public.jobs_queue_index;
       public                 postgres    false    226            �           1259    21146    sessions_last_activity_index    INDEX     Z   CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);
 0   DROP INDEX public.sessions_last_activity_index;
       public                 postgres    false    222            �           1259    21145    sessions_user_id_index    INDEX     N   CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);
 *   DROP INDEX public.sessions_user_id_index;
       public                 postgres    false    222            �           2606    21328 +   activity_logs activity_logs_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.activity_logs DROP CONSTRAINT activity_logs_user_id_foreign;
       public               postgres    false    220    4987    243            �           2606    21390 $   addresses addresses_emerg_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_emerg_id_foreign FOREIGN KEY (emerg_id) REFERENCES public.emergency_contacts(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.addresses DROP CONSTRAINT addresses_emerg_id_foreign;
       public               postgres    false    5036    251    249            �           2606    21385 $   addresses addresses_house_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_house_id_foreign FOREIGN KEY (house_id) REFERENCES public.households(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.addresses DROP CONSTRAINT addresses_house_id_foreign;
       public               postgres    false    245    5032    251            �           2606    21395 #   addresses addresses_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
 M   ALTER TABLE ONLY public.addresses DROP CONSTRAINT addresses_prof_id_foreign;
       public               postgres    false    5034    247    251            �           2606    21209 +   announcements announcements_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.announcements DROP CONSTRAINT announcements_user_id_foreign;
       public               postgres    false    4987    233    220            �           2606    21589 '   attachments attachments_comp_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_comp_id_foreign FOREIGN KEY (comp_id) REFERENCES public.complaints(id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_comp_id_foreign;
       public               postgres    false    257    263    5044            �           2606    34972 '   attachments attachments_form_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_form_id_foreign FOREIGN KEY (form_id) REFERENCES public.sectoral_forms(id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_form_id_foreign;
       public               postgres    false    263    292    5088            �           2606    21627 '   attachments attachments_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_prof_id_foreign;
       public               postgres    false    5034    247    263            �           2606    23061 *   attachments attachments_sign_up_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_sign_up_id_foreign FOREIGN KEY (sign_up_id) REFERENCES public.sign_up_requests(id) ON DELETE CASCADE;
 T   ALTER TABLE ONLY public.attachments DROP CONSTRAINT attachments_sign_up_id_foreign;
       public               postgres    false    288    263    5082                        2606    21617 4   barangay_officials barangay_officials_bar_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.barangay_officials
    ADD CONSTRAINT barangay_officials_bar_id_foreign FOREIGN KEY (bar_id) REFERENCES public.barangays(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.barangay_officials DROP CONSTRAINT barangay_officials_bar_id_foreign;
       public               postgres    false    267    253    5040                       2606    21622 5   barangay_officials barangay_officials_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.barangay_officials
    ADD CONSTRAINT barangay_officials_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.barangay_officials DROP CONSTRAINT barangay_officials_prof_id_foreign;
       public               postgres    false    5034    247    267                       2606    22248 #   childrens childrens_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.childrens
    ADD CONSTRAINT childrens_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.childrens DROP CONSTRAINT childrens_prof_id_foreign;
       public               postgres    false    280    5034    247            �           2606    21570 2   committee_members committee_members_com_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.committee_members
    ADD CONSTRAINT committee_members_com_id_foreign FOREIGN KEY (com_id) REFERENCES public.committees(id) ON DELETE CASCADE;
 \   ALTER TABLE ONLY public.committee_members DROP CONSTRAINT committee_members_com_id_foreign;
       public               postgres    false    261    255    5042            �           2606    21575 5   committee_members committee_members_member_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.committee_members
    ADD CONSTRAINT committee_members_member_id_foreign FOREIGN KEY (member_id) REFERENCES public.members(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.committee_members DROP CONSTRAINT committee_members_member_id_foreign;
       public               postgres    false    259    261    5046            �           2606    21603 E   complaint_status_histories complaint_status_histories_comp_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.complaint_status_histories
    ADD CONSTRAINT complaint_status_histories_comp_id_foreign FOREIGN KEY (comp_id) REFERENCES public.complaints(id) ON DELETE CASCADE;
 o   ALTER TABLE ONLY public.complaint_status_histories DROP CONSTRAINT complaint_status_histories_comp_id_foreign;
       public               postgres    false    257    265    5044            �           2606    21538 $   complaints complaints_com_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_com_id_foreign FOREIGN KEY (com_id) REFERENCES public.committees(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_com_id_foreign;
       public               postgres    false    5042    257    255            �           2606    21533 %   complaints complaints_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.complaints DROP CONSTRAINT complaints_user_id_foreign;
       public               postgres    false    4987    220    257                       2606    21737 4   document_requests document_requests_staff_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT document_requests_staff_id_foreign FOREIGN KEY (staff_id) REFERENCES public.users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.document_requests DROP CONSTRAINT document_requests_staff_id_foreign;
       public               postgres    false    220    273    4987                       2606    21732 3   document_requests document_requests_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.document_requests
    ADD CONSTRAINT document_requests_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.document_requests DROP CONSTRAINT document_requests_user_id_foreign;
       public               postgres    false    220    4987    273            �           2606    21371 5   emergency_contacts emergency_contacts_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.emergency_contacts DROP CONSTRAINT emergency_contacts_prof_id_foreign;
       public               postgres    false    5034    249    247                       2606    22295    erpas erpas_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.erpas
    ADD CONSTRAINT erpas_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.erpas DROP CONSTRAINT erpas_prof_id_foreign;
       public               postgres    false    5034    247    284            �           2606    21314 #   feedbacks feedbacks_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.feedbacks DROP CONSTRAINT feedbacks_user_id_foreign;
       public               postgres    false    220    4987    241                       2606    21696 @   household_join_requests household_join_requests_house_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.household_join_requests
    ADD CONSTRAINT household_join_requests_house_id_foreign FOREIGN KEY (house_id) REFERENCES public.households(id) ON DELETE CASCADE;
 j   ALTER TABLE ONLY public.household_join_requests DROP CONSTRAINT household_join_requests_house_id_foreign;
       public               postgres    false    245    5032    271                       2606    21691 ?   household_join_requests household_join_requests_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.household_join_requests
    ADD CONSTRAINT household_join_requests_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 i   ALTER TABLE ONLY public.household_join_requests DROP CONSTRAINT household_join_requests_user_id_foreign;
       public               postgres    false    271    4987    220                       2606    22125 4   household_members household_members_house_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_house_id_foreign FOREIGN KEY (house_id) REFERENCES public.households(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.household_members DROP CONSTRAINT household_members_house_id_foreign;
       public               postgres    false    5032    275    245            	           2606    22130 3   household_members household_members_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.household_members
    ADD CONSTRAINT household_members_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.household_members DROP CONSTRAINT household_members_prof_id_foreign;
       public               postgres    false    247    275    5034                       2606    22283    lgbts lgbts_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.lgbts
    ADD CONSTRAINT lgbts_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 E   ALTER TABLE ONLY public.lgbts DROP CONSTRAINT lgbts_prof_id_foreign;
       public               postgres    false    5034    247    283            �           2606    21550    members members_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.members DROP CONSTRAINT members_user_id_foreign;
       public               postgres    false    259    4987    220            �           2606    21294 ,   notifications notifications_staff_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_staff_id_foreign FOREIGN KEY (staff_id) REFERENCES public.users(id) ON DELETE SET NULL;
 V   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_staff_id_foreign;
       public               postgres    false    239    4987    220            �           2606    21289 +   notifications notifications_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.notifications DROP CONSTRAINT notifications_user_id_foreign;
       public               postgres    false    220    239    4987            �           2606    21352 "   profiles profiles_house_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_house_id_foreign FOREIGN KEY (house_id) REFERENCES public.households(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.profiles DROP CONSTRAINT profiles_house_id_foreign;
       public               postgres    false    5032    245    247                       2606    22271    pwds pwds_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.pwds
    ADD CONSTRAINT pwds_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.pwds DROP CONSTRAINT pwds_prof_id_foreign;
       public               postgres    false    247    5034    282            
           2606    22154 7   role_permissions role_permissions_permission_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;
 a   ALTER TABLE ONLY public.role_permissions DROP CONSTRAINT role_permissions_permission_id_foreign;
       public               postgres    false    279    277    5064                       2606    22149 1   role_permissions role_permissions_role_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.role_permissions DROP CONSTRAINT role_permissions_role_id_foreign;
       public               postgres    false    5022    235    279            �           2606    21240 $   role_users role_user_role_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.role_users
    ADD CONSTRAINT role_user_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.role_users DROP CONSTRAINT role_user_role_id_foreign;
       public               postgres    false    235    237    5022            �           2606    21235 $   role_users role_user_user_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.role_users
    ADD CONSTRAINT role_user_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.role_users DROP CONSTRAINT role_user_user_id_foreign;
       public               postgres    false    237    220    4987                       2606    23081 ;   sectoral_requirements sectoral_requirements_form_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.sectoral_requirements
    ADD CONSTRAINT sectoral_requirements_form_id_foreign FOREIGN KEY (form_id) REFERENCES public.sectoral_forms(id) ON DELETE CASCADE;
 e   ALTER TABLE ONLY public.sectoral_requirements DROP CONSTRAINT sectoral_requirements_form_id_foreign;
       public               postgres    false    5088    293    292                       2606    22323    seniors seniors_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.seniors
    ADD CONSTRAINT seniors_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.seniors DROP CONSTRAINT seniors_prof_id_foreign;
       public               postgres    false    247    286    5034                       2606    22307 )   solo_parents solo_parents_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.solo_parents
    ADD CONSTRAINT solo_parents_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.solo_parents DROP CONSTRAINT solo_parents_prof_id_foreign;
       public               postgres    false    247    5034    285                       2606    23086 1   temp_submissions temp_submissions_form_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.temp_submissions
    ADD CONSTRAINT temp_submissions_form_id_foreign FOREIGN KEY (form_id) REFERENCES public.sectoral_forms(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.temp_submissions DROP CONSTRAINT temp_submissions_form_id_foreign;
       public               postgres    false    269    5088    292                       2606    21662 4   temp_submissions temp_submissions_profile_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.temp_submissions
    ADD CONSTRAINT temp_submissions_profile_id_foreign FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 ^   ALTER TABLE ONLY public.temp_submissions DROP CONSTRAINT temp_submissions_profile_id_foreign;
       public               postgres    false    269    247    5034            �           2606    21648    users users_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
 E   ALTER TABLE ONLY public.users DROP CONSTRAINT users_prof_id_foreign;
       public               postgres    false    5034    247    220                       2606    23056    voters voters_bar_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.voters
    ADD CONSTRAINT voters_bar_id_foreign FOREIGN KEY (bar_id) REFERENCES public.barangays(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY public.voters DROP CONSTRAINT voters_bar_id_foreign;
       public               postgres    false    290    5040    253                       2606    30563 !   voters voters_precinct_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.voters
    ADD CONSTRAINT voters_precinct_id_foreign FOREIGN KEY (precinct_id) REFERENCES public.precinct_numbers(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.voters DROP CONSTRAINT voters_precinct_id_foreign;
       public               postgres    false    5094    298    290                       2606    22259    womens womens_prof_id_foreign    FK CONSTRAINT     �   ALTER TABLE ONLY public.womens
    ADD CONSTRAINT womens_prof_id_foreign FOREIGN KEY (prof_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
 G   ALTER TABLE ONLY public.womens DROP CONSTRAINT womens_prof_id_foreign;
       public               postgres    false    247    5034    281            �     x���ێ�6@�5_�؂�!%�-�>4ɢ@���Vm!^��E��Cڻ��E,$�	x4$���"��n�X���î[��Ͱ-��V�����e��-_��=�C�?�~J(|�E�R�F����ɿ�����Fh��.��a(���w�T�7_5�n����3��ڣD#�c�9���~nK�u?��[�]��&�ywֺ�VM�M���q�4ZF�4[�A�	O�e{$�q���r���7]���Ӿ�����A��Cn�u�\���&�4�R&q�)�������}?P6�u{�|a��K�S` ���13Nss` )3N����H�w�]>�6Q��TȊ��ѲB��#n?�	��12P�������,e2��]s?w�}��^����vuw[�b�FI����9����t⁁r��k�y�i�U�����z�=�L�=0зVbL�T���$��@��}��+��nw���J.��F�j���+�L6��-c�T���#�SNc�IE9F�3��)00�1��cU&]���
�쵧�������1Ic��<;��7����������r��ye�R�uc#�9��jDݠ�����̞�kA::y�c�lyo�{5i#���N��W�t��G���0�}�8n#���Z����e�S�(��r-�3i�<D%]�+s��+N���������az�Fv�Ո��6��k�l��X����l��H��rl�qi�����g{O�߉} �c਍Y��Mw(��?|xo��AOy2Mn>�p�1p��UJrVJi�1pU֢��Vt9�V�'RUR��:JˑA%f'RUJ�cP�����Nc����NI�C�1�1k�k_�iWrj���a����Ƞ�^]�^�a0���1�o5�7Z��r����2�<�.���GI�Х8�%'���h����\�����+HIY�Ͽ"���[m�Ț�A^a�G	�8FZ�;n͍h1��G�lFZ��U0��s#��t^M�����v��S7�Q~s��}�]�W��/��23L��T�1r��{�_�k�rR��UG�ž=�z �z�,������p,>)�.P�q�7[�q�7������a���F��8�T�).���u1Ҳ��A���s~��ʞ��U�k�i��`�� bd�����뒿	-�@R�����r|Y�YeV��&u��H�s��֖���cd�9���G	[Ԉ�6瀝:��	#+{�Y�"YGF֌b6Q(�1��/f��[y�@��)k�[��7��ʦ�#������_?��jH`      �   �   x����j�0@��W�2$9�_s꥗BO�84�B��,c��뤔�b�2�%�-=l�Pw���w��}7��~�mN}8�9C߇��vl��x�h������qk�(˩�O�O�'�%1:,�s�f$F�S��=0O9ڧ~��^��b��Z,���2TzVo5�P��?�����.��"����C��ӹ�����8������Pl��ߊ�       �   W  x�m��N�0���S����6�v�H�.\��k��O��6���e$n���_�s�MQ��R/�� ��d!�2�n�tl4��и�����(��1�t� =�w ��J
����A��v0�y��׬:P�gG�ihI_ 2���y8����i�v`T�ǐ|�ϻ�L���*�ǐC�JҥJ�LP
-44�bL<���lYz'K!��k'���(`G�72q�������0��A�(��͍��I?�4	�c�v�>�/!�,O=��̵�~�,d���]!E]֛EY/�5���U�]���=>��}��]�����s��N]��������}w{>�f����r6�� �      �      x������ � �      �   >   x�3�tN,(I���4202�50"ӂ�1�$�,�Ӑ�� .ld�``nelbeb�M�+F��� p�)      �   �   x�UN��@</_� fY|�Ʉh�Acb�K����,��߻��af�t�M��`Zt��X����>��S9_/s��Y��ܴH���n^��\a`;G#�U��B�.��:2)�"2�k.�"˿�3������'(����LM����[��v�n�L̽�!���ՠRh���c��qi�&��� ���:�=�P�jE�P�X+      �   k   x��MLN�K�H,�I-�tH�M���K�ϭ142�3 BC�����"�L+CsCCKCCckN8ۄ+�� �H:L��2S���	Ygl`jjnl �e���
�:F��� ��>�      �      x������ � �      �      x������ � �      �      x������ � �      �   �   x�m�1o�0��ܯ�H%����*ԥ�R�.,�s���3�$��ۦ]B�~z�����mAT�U{QRqx+�6�B�E�(]ۥ���1XM/�z9)ǝj�8��Y��9͟�W�L�%��5TM���t�;:��}첦Җ���0XOMa@������U�L!�-	}"���8Ĥfm����H�����m5u�A5m�\�#�h�;�X�/�twj���XYS�e�G �ν~�      �      x������ � �      �      x������ � �      �   �  x���Mn�0���s�V���dGhE�Q�7�j�S�@{�NZ!�EHV�<Y~߼s�Y@~?"���ƚve����~��-��Z4�6kV(��Z}���n[![>2�y��+�B2�E�'2��џ5�������>e��k����3tA�t��]��k4��_�4Ʌ�j�uW�\yk�`S�v�Cv���U?��[e`ڶM��������b�z�a�@�[�4\ A�2�j=��!��xV޷օ(�Y?�u�َr9�j=J֡؍����n?նm��҄���a�J2n�#CGܪ����Ep�2	5"��,<��ʐ�V����4�=e49�'I��(wo[�}�U�UCS\_���X�7�
g��'L�t����7;���IӪlWJ���z0|�.>      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   n   x�3�tL/��KWJ-�LI�KN�,)*M����̼��T���̜JN���NCKK3.#CKS3NC#c�2##S]#]CK+#c+�b��E%��y%�b���� J�![      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   z  x����r�(����l�e�(Y�1�$�:d�o��,	�3���E\�~��#\](��n���6��gg�ɍ���k�.�p�F��l���i�H���ᚎz��?��x���;7���:���x PK���z�24�wÜ)����GI�]1�h�Erp"U:;�k -JZ��{�%za��#7��,U�2�Knε׺�J�.a���w�����Oۅ�$0I�����#1����C���o�9�e%�(?��h�nh��	Ì�%?�$Kh��M)2J�3q�~��z���	%,9?\�ս�2T�P����fiU�P���ˣ=7��$E�Ξ��C�����^n|�YfQ#+���J����i8N�>�)��@Ï�N��Q�k��|�6�+�� ��"ˤiQ�#��w��!���a	Qy\�W����X������<�܏�K��GW�4W'\��*���g6E���"M�bL�ʟ�I���Rђ����4��2ٻ��0z�ɳW662���	��o|�e�,��s��ƴ���y��[{;�cG�<�1c"���u� ;���y"KZ���f�?�\{?M>��*D���,V\ݯ&��K/�}�����T8é��u��3�xt�,n��� �N[�8T�a��o1�q>��k�"I�j�ű.��統[�<����J3I���Q)���8����o�܌n�ܤ�((��q��Hj�R�UZ�@��2mCf�0J�.��	i^A�ͼ���_���^gD��^����YՅq�i)0���i榘(\]qM�a���@tj)\єa�[�x�l��yIc��7��$�P�pJpc�1<l��u��'��)YEt[��̀��;:�	TeaI�F�f�C��3�91鲜Z\�=�fd���a��Px,�1�j�H\�~��X�=��b�;��i���ͺ[�Z����+�����X`�V�3�lZ{�.�Q�r�A%�6=|_�O��ֹ��gĤ��X	\�u�����;��$���;N�x��5|µn�pN��ƒ��H������v��;�@+P���?J6JeJ�ct���8,��(�N2��9�k^�(*�*	q+JP��8���n��VIxNfь�%u#'�1��iMpI��@B\�ً
\[<�_�յN�r����_�~L���!��<G�      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   �  x����r�0�?�S�vs�|�ں��Z�k���N�($�e�}���Z��v���!9���)ϳO��� �z � ��@�`|ֶ�kfB(�0�BӔ�`4�ޭV�T�È�JB7/R�}���r��i譶����.��4���hyo�f����H�P6�y ��U���S\E�gE��h*��'6H &����T�J�T���ʚ�T�G@n}y�ţ})�j@�0������$`<�.h�	�X�W�7> �A�CfKB!�����`�U�Tp���*!҆!ԋC��%M��~P�*����vNo#ӽ��N�k�0�n��6X9Ffߺ&�g�́�/6��8!K�+�DLy���.���Bވ�I� ����ud�楡�U,?����U{@�{[Q5�T��\o�l�F{��եK���'k�%O͑5_����e���k� Nl�4U��S�eM�ի�׮ئ=.���V�|�6ӗ�2��O/�|�B�; �����V,�(�9�2�D�<�E,�D4��NN�`H��{8٪�<Q�m��@��U�0/�"�GȦ �-�~Ҁ0p^C��%{*w�� �I�O���d�σ-�zא_�g9U��A>D�~QȺ�U���̨.;�� 𥉢Wc��[t�V�4�X��}5S꾉��DiO��N��U�L      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �   E  x���Mo�@���W�-'(I+�F�h�@`	��e��U׻��5����m@�8UE��ڏ�y�}g{�d��t�z&��{�*LŰB�$�f��@'�d�b��B
/�Ad�PBm��β\	�T8H�� Ei0��98��B�s������nQ���Y�UqN�e�_�T�H�4� �?
1v�rB,sT�m���x'pȽ�L~Ak��*���ߵ��v���}��~Ы[k��ُ��ʳ?S�΀�΍Ѷ���Np��<�~r�TL���VًWL�:�JQ��>�O�c����֝RV7NUYt�_���s3�A0zg��d�<��T��B����R��3���}ZG~t�O��J^�EH�ꊛNd�	N�[˲K�SH��6Xn�W�K�I+W2&���~����ȤO99���Sɹ�+f�eu\�^u�m���ќ�m0��Q��b���T�����4��x	�0_(>e���f��#(}����
�1���^T[�l��5�,_}���F��O�}���hNoc�����F�߂�d.V0
���+�5*A�舌�BSY�o���x��~��e\*_��w��j�nT      �   �  x���Mk�0��ѯ�[�,Y,;�Go������2�Ɖ@�\�nɿ�qCvA��y?<#g�C�"@����WC�#�N��fhM���Y^γb.3��![<�ߤ�'�\Þ�p���)y�t�}������9�T��*D~`}�3�0@��d���ӯ����W�]D��-'�5��0��	8�,e"�ܦ����Pq@��4T���N���q;���d�:�c͕��y��(�Ӆn����ǘ�����6��	X{�_�E\T֐6cک�a���nT�ȻU�2�ب�c#�b�i���u��bb����������(�>`���u��{�.�R,���������+�?�Zޑy��kbu:l5�ݦܵX����ڻ"7svF/�y6Qs��!� ���E      �      x������ � �      �   �  x�UP�n�0]'_���F�m�uEC&!�qKixh6�2�؁I�@��q��hFwq�s�y�F��O�>�=/K�r��w_�� U����~:�ϧ	B.�"k��	iG&D67g@��رl�w�5��M�x�l�kN׉*��'v���5ӱv��	��&XSi�h�{mY�ZY͡n|& �5;d'�G2I���y�<���A��"g�U�- n�|���Q�>���-n�h�U\��|�u���'I\�����7)���V�R\˘0�V���7*�gT'��{������b �������
S�����i�,��϶ң�Tu�~~���|�򅹝u���ز\�u��)wp�C����������K��"H�mMƴN�'һ��Q�YA�>J�A2��k��� �cRW4*��ܻ�pe�y-C�L ,s�c6�Nl���      �      x������ � �      �      x������ � �      �      x������ � �      �   5  x�m�Ks�J�5|�,��5��nX�F���bj6-o�a����xo25�l��]�;��i���C�YVy��IY��s�f�_�ʯ�r��{��9�x�ֶɰ�??�W���9��=�6E3ܥ�������Ey'��>�� ��w�Dtfף�0���1����*PE�.=�e'k��|i�v�-��=O5�����é���Q�9�[~6��s>о��u���z�A�	e��T|E����"�%ĝ8P��/߃�YuH��ڭ�락�WM|���8�?6t�����{�A�Aygv�1D1���T�'aQe~,y�D���� 笏.N(={;I�h&bx����ɌB�Ն��|U�k��6�_Br���AEgv��3�
�ʔ]���,
��@Pt�F��r[��h礉Hb�!\��n�9�=?�5�V��h��s4z�?��.��ovbʉN� �@�r��*��yV2��"�2�NW�"�rެ��MG+/\�����n��Au��h1A�z������;\�3�o 1���7�P�J���;i�Jt�.�=�x0�^M[N��>���,ͽW	�ۜ���"��w607 ��n4
(��#�I*J.}Y�����:u��^�f:���h�MQ7�:$ϗ�Ӆ�V}�&f�s/�Sy��4�K�?����wf7�D`F���� !Rd���[�ͼYI
5��jv���Z�xM�E���ߚ�̗Gsݐ���j�]޾���,�������1��F��3�' /Xd\6'/�������6_�u|�� _�٭(�����_+B���4UU�ƙ      �      x������ � �      �      x������ � �     