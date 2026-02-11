-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "certification_level" TEXT,
    "club_affiliation" TEXT,
    "bio" TEXT,
    "profile_image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "family_id" TEXT NOT NULL,
    "device_info" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMP(3),
    "revoked_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" TEXT NOT NULL,
    "coach_id" TEXT NOT NULL,
    "user_id" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "sailing_experience_years" INTEGER,
    "skill_level" TEXT,
    "boat_types" TEXT[],
    "certifications" TEXT[],
    "medical_notes" TEXT,
    "profile_image_url" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "coach_id" TEXT NOT NULL,
    "session_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "session_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "location_name" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "water_body" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weather_conditions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "temperature_celsius" DOUBLE PRECISION,
    "wind_speed_knots" DOUBLE PRECISION,
    "wind_direction_degrees" INTEGER,
    "wind_gusts_knots" DOUBLE PRECISION,
    "wave_height_meters" DOUBLE PRECISION,
    "visibility_km" DOUBLE PRECISION,
    "weather_description" TEXT,
    "sea_state" TEXT,
    "tide_state" TEXT,
    "data_source" TEXT NOT NULL DEFAULT 'manual',
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weather_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_session_data" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "athlete_id" TEXT NOT NULL,
    "skill_focus" TEXT[],
    "performance_rating" INTEGER,
    "technique_notes" TEXT,
    "improvement_areas" TEXT[],
    "strengths_observed" TEXT[],
    "boat_used" TEXT,
    "sail_configuration" TEXT,
    "distance_sailed_nm" DOUBLE PRECISION,
    "session_goals" TEXT[],
    "goals_achieved" TEXT[],
    "next_session_focus" TEXT[],
    "overall_satisfaction" INTEGER,
    "coach_notes" TEXT,
    "athlete_feedback" TEXT,
    "athlete_self_rating" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_session_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_hash_key" ON "refresh_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_family_id_idx" ON "refresh_tokens"("family_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_user_id_key" ON "athletes"("user_id");

-- CreateIndex
CREATE INDEX "athletes_coach_id_idx" ON "athletes"("coach_id");

-- CreateIndex
CREATE INDEX "sessions_coach_id_idx" ON "sessions"("coach_id");

-- CreateIndex
CREATE INDEX "sessions_session_date_idx" ON "sessions"("session_date");

-- CreateIndex
CREATE INDEX "sessions_status_idx" ON "sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "weather_conditions_session_id_key" ON "weather_conditions"("session_id");

-- CreateIndex
CREATE INDEX "training_session_data_session_id_idx" ON "training_session_data"("session_id");

-- CreateIndex
CREATE INDEX "training_session_data_athlete_id_idx" ON "training_session_data"("athlete_id");

-- CreateIndex
CREATE UNIQUE INDEX "training_session_data_session_id_athlete_id_key" ON "training_session_data"("session_id", "athlete_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weather_conditions" ADD CONSTRAINT "weather_conditions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_session_data" ADD CONSTRAINT "training_session_data_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_session_data" ADD CONSTRAINT "training_session_data_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
