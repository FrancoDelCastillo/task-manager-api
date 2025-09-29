drop extension if exists "pg_net";

drop policy "profiles_insert_own" on "public"."profiles";

revoke delete on table "public"."board_members" from "anon";

revoke insert on table "public"."board_members" from "anon";

revoke references on table "public"."board_members" from "anon";

revoke select on table "public"."board_members" from "anon";

revoke trigger on table "public"."board_members" from "anon";

revoke truncate on table "public"."board_members" from "anon";

revoke update on table "public"."board_members" from "anon";

revoke references on table "public"."board_members" from "authenticated";

revoke trigger on table "public"."board_members" from "authenticated";

revoke truncate on table "public"."board_members" from "authenticated";

revoke delete on table "public"."board_members" from "service_role";

revoke insert on table "public"."board_members" from "service_role";

revoke references on table "public"."board_members" from "service_role";

revoke select on table "public"."board_members" from "service_role";

revoke trigger on table "public"."board_members" from "service_role";

revoke truncate on table "public"."board_members" from "service_role";

revoke update on table "public"."board_members" from "service_role";

revoke delete on table "public"."boards" from "anon";

revoke insert on table "public"."boards" from "anon";

revoke references on table "public"."boards" from "anon";

revoke select on table "public"."boards" from "anon";

revoke trigger on table "public"."boards" from "anon";

revoke truncate on table "public"."boards" from "anon";

revoke update on table "public"."boards" from "anon";

revoke delete on table "public"."boards" from "service_role";

revoke insert on table "public"."boards" from "service_role";

revoke references on table "public"."boards" from "service_role";

revoke select on table "public"."boards" from "service_role";

revoke trigger on table "public"."boards" from "service_role";

revoke truncate on table "public"."boards" from "service_role";

revoke update on table "public"."boards" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."tasks" from "anon";

revoke insert on table "public"."tasks" from "anon";

revoke references on table "public"."tasks" from "anon";

revoke select on table "public"."tasks" from "anon";

revoke trigger on table "public"."tasks" from "anon";

revoke truncate on table "public"."tasks" from "anon";

revoke update on table "public"."tasks" from "anon";

revoke references on table "public"."tasks" from "authenticated";

revoke trigger on table "public"."tasks" from "authenticated";

revoke truncate on table "public"."tasks" from "authenticated";

revoke delete on table "public"."tasks" from "service_role";

revoke insert on table "public"."tasks" from "service_role";

revoke references on table "public"."tasks" from "service_role";

revoke select on table "public"."tasks" from "service_role";

revoke trigger on table "public"."tasks" from "service_role";

revoke truncate on table "public"."tasks" from "service_role";

revoke update on table "public"."tasks" from "service_role";


