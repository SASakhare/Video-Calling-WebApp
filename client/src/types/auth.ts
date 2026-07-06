import { string } from "zod";

export interface RegisterPost{
    first_name: string;
    last_name: string;
    company: string;
    job_title: string;
    email: string;
    password: string;
};


export interface LoginPost  {
    email: string;
    password: string;
};