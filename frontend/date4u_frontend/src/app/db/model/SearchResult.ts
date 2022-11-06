import { Profile } from "src/app/db/model/Profile";

export interface SearchResult {
    profilesPage: Profile[];
    countAllProfiles: number;
    currentPage: number;
}