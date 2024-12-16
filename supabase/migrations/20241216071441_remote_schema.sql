

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE SCHEMA IF NOT EXISTS "dev";


ALTER SCHEMA "dev" OWNER TO "postgres";


CREATE SCHEMA IF NOT EXISTS "pgmq";


ALTER SCHEMA "pgmq" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "test";


ALTER SCHEMA "test" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgmq" WITH SCHEMA "pgmq";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "dev"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  default_team_id uuid;
begin
  -- Create a default team if none exists
  if not exists (select 1 from dev.teams limit 1) then
    insert into dev.teams (name) values ('Default Team')
    returning id into default_team_id;
  else
    select id into default_team_id from dev.teams limit 1;
  end if;

  -- Create a profile for the new user
  insert into dev.profiles (id, email, full_name, team_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    default_team_id
  );
  return new;
end;
$$;


ALTER FUNCTION "dev"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "dev"."test"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
END;$$;


ALTER FUNCTION "dev"."test"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  default_team_id uuid;
begin
  -- Create a default team if none exists
  if not exists (select 1 from public.teams limit 1) then
    insert into public.teams (name) values ('Default Team')
    returning id into default_team_id;
  else
    select id into default_team_id from public.teams limit 1;
  end if;

  -- Create a profile for the new user
  insert into public.profiles (id, email, full_name, team_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    default_team_id
  );
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."test"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$BEGIN
END;$$;


ALTER FUNCTION "public"."test"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "dev"."event_schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "dev"."event_schedules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."event_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_admin" boolean DEFAULT false,
    "is_staff" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "dev"."event_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "location" "text",
    "team_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "slug" "text" NOT NULL,
    "is_activated" boolean DEFAULT false,
    "mode" "text" DEFAULT 'inperson'::"text" NOT NULL,
    "broadcast_url" "text",
    "team_slug" "text" NOT NULL
);


ALTER TABLE "dev"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."lottery_winners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "participant_id" "uuid" NOT NULL,
    "round" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "for_prize" boolean DEFAULT false NOT NULL
);


ALTER TABLE "dev"."lottery_winners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "nickname" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "attendance_mode" "text" DEFAULT 'inperson'::"text" NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "dev"."participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "team_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "dev"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."survey_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "survey_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "type" "text" NOT NULL,
    "options" "jsonb",
    "order_number" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "survey_questions_type_check" CHECK (("type" = ANY (ARRAY['number'::"text", 'text'::"text", 'multiline'::"text", 'multiple-choice'::"text", 'rating'::"text", 'boolean'::"text"])))
);


ALTER TABLE "dev"."survey_questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."survey_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question_id" "uuid",
    "participant_id" "uuid",
    "recorded_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "response" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid"
);


ALTER TABLE "dev"."survey_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."surveys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "dev"."surveys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."team_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_admin" boolean DEFAULT false,
    "is_staff" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "dev"."team_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "dev"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "slug" "text" NOT NULL
);


ALTER TABLE "dev"."teams" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."event_schedules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."event_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_admin" boolean DEFAULT false,
    "is_staff" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."event_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "location" "text",
    "team_id" "uuid" NOT NULL,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "slug" "text" NOT NULL,
    "is_activated" boolean DEFAULT false,
    "mode" "text" DEFAULT 'inperson'::"text" NOT NULL,
    "broadcast_url" "text",
    "team_slug" "text" NOT NULL
);


ALTER TABLE "public"."events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lottery_winners" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "participant_id" "uuid" NOT NULL,
    "round" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "for_prize" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."lottery_winners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."participants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "nickname" "text" NOT NULL,
    "email" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "attendance_mode" "text" DEFAULT 'inperson'::"text" NOT NULL,
    "user_id" "uuid"
);


ALTER TABLE "public"."participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "full_name" "text",
    "team_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."survey_questions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "survey_id" "uuid" NOT NULL,
    "question" "text" NOT NULL,
    "type" "text" NOT NULL,
    "options" "jsonb",
    "order_number" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "survey_questions_type_check" CHECK (("type" = ANY (ARRAY['number'::"text", 'text'::"text", 'multiline'::"text", 'multiple-choice'::"text", 'rating'::"text", 'boolean'::"text"])))
);


ALTER TABLE "public"."survey_questions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."survey_responses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "question_id" "uuid",
    "participant_id" "uuid",
    "recorded_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "response" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_id" "uuid",
    "event_id" "uuid"
);


ALTER TABLE "public"."survey_responses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."surveys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."surveys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."team_users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "team_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "is_admin" boolean DEFAULT false,
    "is_staff" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."team_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "slug" "text" NOT NULL
);


ALTER TABLE "public"."teams" OWNER TO "postgres";


ALTER TABLE ONLY "dev"."event_schedules"
    ADD CONSTRAINT "event_schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."event_users"
    ADD CONSTRAINT "event_users_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "dev"."event_users"
    ADD CONSTRAINT "event_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."events"
    ADD CONSTRAINT "events_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "dev"."events"
    ADD CONSTRAINT "events_slug_key1" UNIQUE ("slug");



ALTER TABLE ONLY "dev"."lottery_winners"
    ADD CONSTRAINT "lottery_winners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."participants"
    ADD CONSTRAINT "participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."survey_questions"
    ADD CONSTRAINT "survey_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."survey_responses"
    ADD CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."surveys"
    ADD CONSTRAINT "surveys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."team_users"
    ADD CONSTRAINT "team_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."team_users"
    ADD CONSTRAINT "team_users_team_id_user_id_key" UNIQUE ("team_id", "user_id");



ALTER TABLE ONLY "dev"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "dev"."teams"
    ADD CONSTRAINT "teams_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."event_schedules"
    ADD CONSTRAINT "event_schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."event_users"
    ADD CONSTRAINT "event_users_event_id_user_id_key" UNIQUE ("event_id", "user_id");



ALTER TABLE ONLY "public"."event_users"
    ADD CONSTRAINT "event_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."lottery_winners"
    ADD CONSTRAINT "lottery_winners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."participants"
    ADD CONSTRAINT "participants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."survey_questions"
    ADD CONSTRAINT "survey_questions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."surveys"
    ADD CONSTRAINT "surveys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_users"
    ADD CONSTRAINT "team_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."team_users"
    ADD CONSTRAINT "team_users_team_id_user_id_key" UNIQUE ("team_id", "user_id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_slug_unique" UNIQUE ("slug");



CREATE UNIQUE INDEX "events_slug_idx" ON "dev"."events" USING "btree" ("slug") WHERE ("is_activated" = true);



CREATE INDEX "events_slug_idx1" ON "dev"."events" USING "btree" ("slug");



CREATE INDEX "survey_questions_survey_id_idx" ON "dev"."survey_questions" USING "btree" ("survey_id");



CREATE INDEX "survey_responses_question_id_idx" ON "dev"."survey_responses" USING "btree" ("question_id");



CREATE INDEX "survey_responses_user_id_idx" ON "dev"."survey_responses" USING "btree" ("participant_id");



CREATE UNIQUE INDEX "events_activated_slug_idx" ON "public"."events" USING "btree" ("slug") WHERE ("is_activated" = true);



CREATE INDEX "events_slug_idx" ON "public"."events" USING "btree" ("slug");



CREATE INDEX "idx_survey_questions_survey_id" ON "public"."survey_questions" USING "btree" ("survey_id");



CREATE INDEX "idx_survey_responses_question_id" ON "public"."survey_responses" USING "btree" ("question_id");



CREATE INDEX "idx_survey_responses_user_id" ON "public"."survey_responses" USING "btree" ("participant_id");



ALTER TABLE ONLY "public"."event_schedules"
    ADD CONSTRAINT "event_schedules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."event_schedules"
    ADD CONSTRAINT "event_schedules_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");



ALTER TABLE ONLY "public"."event_users"
    ADD CONSTRAINT "event_users_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");



ALTER TABLE ONLY "public"."event_users"
    ADD CONSTRAINT "event_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_team_slug_fkey" FOREIGN KEY ("team_slug") REFERENCES "public"."teams"("slug");



ALTER TABLE ONLY "public"."lottery_winners"
    ADD CONSTRAINT "lottery_winners_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lottery_winners"
    ADD CONSTRAINT "lottery_winners_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."participants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."participants"
    ADD CONSTRAINT "participants_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."participants"
    ADD CONSTRAINT "participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id");



ALTER TABLE ONLY "public"."survey_questions"
    ADD CONSTRAINT "survey_questions_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "public"."surveys"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id");



ALTER TABLE ONLY "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."survey_questions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."survey_responses"
    ADD CONSTRAINT "survey_responses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."surveys"
    ADD CONSTRAINT "surveys_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."team_users"
    ADD CONSTRAINT "team_users_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id");



ALTER TABLE ONLY "public"."team_users"
    ADD CONSTRAINT "team_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."teams"
    ADD CONSTRAINT "teams_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id");



CREATE POLICY "Anyone can register as a participant" ON "public"."participants" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can view event details" ON "public"."events" FOR SELECT USING (true);



CREATE POLICY "Anyone can view event schedules" ON "public"."event_schedules" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Anyone can view lottery winners" ON "public"."lottery_winners" FOR SELECT USING (true);



CREATE POLICY "Anyone can view participants" ON "public"."participants" FOR SELECT USING (true);



CREATE POLICY "Event admins can manage event users" ON "public"."event_users" TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "public"."event_users" "eu"
  WHERE (("eu"."event_id" = "event_users"."event_id") AND ("eu"."user_id" = "auth"."uid"()) AND ("eu"."is_admin" = true)))) OR ("user_id" = "auth"."uid"())));



CREATE POLICY "Event staff and admins can manage schedules" ON "public"."event_schedules" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."events" "e"
  WHERE (("e"."id" = "event_schedules"."event_id") AND (EXISTS ( SELECT 1
           FROM "public"."event_users" "eu"
          WHERE (("eu"."event_id" = "e"."id") AND ("eu"."user_id" = "auth"."uid"()) AND (("eu"."is_admin" = true) OR ("eu"."is_staff" = true)))))))));



CREATE POLICY "Team admins can manage team users" ON "public"."team_users" TO "authenticated" USING (("team_id" IN ( SELECT "tu"."team_id"
   FROM "public"."team_users" "tu"
  WHERE (("tu"."user_id" = "auth"."uid"()) AND ("tu"."is_admin" = true)))));



CREATE POLICY "Team members can create events" ON "public"."events" FOR INSERT WITH CHECK (("team_id" IN ( SELECT "profiles"."team_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "Team members can manage lottery winners" ON "public"."lottery_winners" USING (("event_id" IN ( SELECT "events"."id"
   FROM "public"."events"
  WHERE ("events"."team_id" IN ( SELECT "profiles"."team_id"
           FROM "public"."profiles"
          WHERE ("profiles"."id" = "auth"."uid"()))))));



CREATE POLICY "Team members can manage their events" ON "public"."events" USING (("team_id" IN ( SELECT "profiles"."team_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "Team members can view event participants" ON "public"."participants" FOR SELECT USING (("event_id" IN ( SELECT "events"."id"
   FROM "public"."events"
  WHERE ("events"."team_id" IN ( SELECT "profiles"."team_id"
           FROM "public"."profiles"
          WHERE ("profiles"."id" = "auth"."uid"()))))));



CREATE POLICY "Team members can view their team" ON "public"."teams" FOR SELECT USING (("id" IN ( SELECT "profiles"."team_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "Team members can view their team's events" ON "public"."events" FOR SELECT USING (("team_id" IN ( SELECT "profiles"."team_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can view their own event roles" ON "public"."event_users" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can view their own team roles" ON "public"."team_users" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
























GRANT ALL ON FUNCTION "dev"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "dev"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "dev"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "dev"."test"() TO "anon";
GRANT ALL ON FUNCTION "dev"."test"() TO "authenticated";
GRANT ALL ON FUNCTION "dev"."test"() TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."test"() TO "anon";
GRANT ALL ON FUNCTION "public"."test"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."test"() TO "service_role";









GRANT ALL ON TABLE "dev"."event_schedules" TO "anon";
GRANT ALL ON TABLE "dev"."event_schedules" TO "authenticated";
GRANT ALL ON TABLE "dev"."event_schedules" TO "service_role";



GRANT ALL ON TABLE "dev"."event_users" TO "anon";
GRANT ALL ON TABLE "dev"."event_users" TO "authenticated";
GRANT ALL ON TABLE "dev"."event_users" TO "service_role";



GRANT ALL ON TABLE "dev"."events" TO "anon";
GRANT ALL ON TABLE "dev"."events" TO "authenticated";
GRANT ALL ON TABLE "dev"."events" TO "service_role";



GRANT ALL ON TABLE "dev"."lottery_winners" TO "anon";
GRANT ALL ON TABLE "dev"."lottery_winners" TO "authenticated";
GRANT ALL ON TABLE "dev"."lottery_winners" TO "service_role";



GRANT ALL ON TABLE "dev"."participants" TO "anon";
GRANT ALL ON TABLE "dev"."participants" TO "authenticated";
GRANT ALL ON TABLE "dev"."participants" TO "service_role";



GRANT ALL ON TABLE "dev"."profiles" TO "anon";
GRANT ALL ON TABLE "dev"."profiles" TO "authenticated";
GRANT ALL ON TABLE "dev"."profiles" TO "service_role";



GRANT ALL ON TABLE "dev"."survey_questions" TO "anon";
GRANT ALL ON TABLE "dev"."survey_questions" TO "authenticated";
GRANT ALL ON TABLE "dev"."survey_questions" TO "service_role";



GRANT ALL ON TABLE "dev"."survey_responses" TO "anon";
GRANT ALL ON TABLE "dev"."survey_responses" TO "authenticated";
GRANT ALL ON TABLE "dev"."survey_responses" TO "service_role";



GRANT ALL ON TABLE "dev"."surveys" TO "anon";
GRANT ALL ON TABLE "dev"."surveys" TO "authenticated";
GRANT ALL ON TABLE "dev"."surveys" TO "service_role";



GRANT ALL ON TABLE "dev"."team_users" TO "anon";
GRANT ALL ON TABLE "dev"."team_users" TO "authenticated";
GRANT ALL ON TABLE "dev"."team_users" TO "service_role";



GRANT ALL ON TABLE "dev"."teams" TO "anon";
GRANT ALL ON TABLE "dev"."teams" TO "authenticated";
GRANT ALL ON TABLE "dev"."teams" TO "service_role";


















GRANT ALL ON TABLE "public"."event_schedules" TO "anon";
GRANT ALL ON TABLE "public"."event_schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."event_schedules" TO "service_role";



GRANT ALL ON TABLE "public"."event_users" TO "anon";
GRANT ALL ON TABLE "public"."event_users" TO "authenticated";
GRANT ALL ON TABLE "public"."event_users" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON TABLE "public"."lottery_winners" TO "anon";
GRANT ALL ON TABLE "public"."lottery_winners" TO "authenticated";
GRANT ALL ON TABLE "public"."lottery_winners" TO "service_role";



GRANT ALL ON TABLE "public"."participants" TO "anon";
GRANT ALL ON TABLE "public"."participants" TO "authenticated";
GRANT ALL ON TABLE "public"."participants" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."survey_questions" TO "anon";
GRANT ALL ON TABLE "public"."survey_questions" TO "authenticated";
GRANT ALL ON TABLE "public"."survey_questions" TO "service_role";



GRANT ALL ON TABLE "public"."survey_responses" TO "anon";
GRANT ALL ON TABLE "public"."survey_responses" TO "authenticated";
GRANT ALL ON TABLE "public"."survey_responses" TO "service_role";



GRANT ALL ON TABLE "public"."surveys" TO "anon";
GRANT ALL ON TABLE "public"."surveys" TO "authenticated";
GRANT ALL ON TABLE "public"."surveys" TO "service_role";



GRANT ALL ON TABLE "public"."team_users" TO "anon";
GRANT ALL ON TABLE "public"."team_users" TO "authenticated";
GRANT ALL ON TABLE "public"."team_users" TO "service_role";



GRANT ALL ON TABLE "public"."teams" TO "anon";
GRANT ALL ON TABLE "public"."teams" TO "authenticated";
GRANT ALL ON TABLE "public"."teams" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "pgmq" GRANT SELECT ON SEQUENCES  TO "pg_monitor";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "pgmq" GRANT SELECT ON TABLES  TO "pg_monitor";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
