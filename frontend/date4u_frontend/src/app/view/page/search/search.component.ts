import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { AuthService } from 'src/app/business_logic/service/auth/auth.service';
import { Photo } from 'src/app/db/model/Photo';
import { SearchFilter } from 'src/app/db/model/SearchFilter';
import { SearchResult } from 'src/app/db/model/SearchResult';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';
import { PhotoRepositoryService } from 'src/app/db/repository/photo-repository/photo-repository.service';
import { ProfileRepositoryService } from 'src/app/db/repository/profile-repository/profile-repository.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  // template attributes
  ages: Array<number>;
  hornlengths: Array<number>;
  genders = ['Weiblich', 'Männlich', 'Divers'];
  profileRows: any = [];
  siteCurrent = 0;
  siteEnd = 0;
  countAllProfiles = 0;
  countPaginationButtons: Array<any> = [];
  profileId: number | undefined;

  // intern attributes
  private PAGE_SIZE = 8;
  private ageStart = 18;
  private ageEnd = 99;
  private hornlengthStart = 1;
  private hornlengthEnd = 30;
  private gender = 0;

  private static bundleBackupData: any = {};

  constructor(
    private profileRepo: ProfileRepositoryService,
    private photoRepo: PhotoRepositoryService,
    private jwtRepo: JwtRepositoryService,
    private authService: AuthService
  ) {
    this.ages = [];
    for (let age = this.ageStart; age <= this.ageEnd; age++) {
      this.ages.push(age);
    }

    this.hornlengths = [];
    for (let hornlength = this.hornlengthStart;
      hornlength <= this.hornlengthEnd;
      hornlength++) {
      this.hornlengths.push(hornlength);
    }

    this.profileId = jwtRepo.getJwt()?.profileId;
  }

  ngOnInit(): void {
    if (Object.keys(SearchComponent.bundleBackupData).length > 0) {
      this.ages = SearchComponent.bundleBackupData.ages;
      this.hornlengths = SearchComponent.bundleBackupData.hornlengths;
      this.genders = SearchComponent.bundleBackupData.genders;
      this.profileRows = SearchComponent.bundleBackupData.profileRows;
      this.siteCurrent = SearchComponent.bundleBackupData.siteCurrent;
      this.siteEnd = SearchComponent.bundleBackupData.siteEnd;
      this.countAllProfiles = SearchComponent.bundleBackupData.countAllProfiles;
      this.countPaginationButtons = SearchComponent.bundleBackupData.countPaginationButtons;
      this.PAGE_SIZE = SearchComponent.bundleBackupData.pageSize;
      this.ageStart = SearchComponent.bundleBackupData.ageStart;
      this.ageEnd = SearchComponent.bundleBackupData.ageEnd;
      this.hornlengthStart = SearchComponent.bundleBackupData.hornlengthStart;
      this.hornlengthEnd = SearchComponent.bundleBackupData.hornlengthEnd;
      this.gender = SearchComponent.bundleBackupData.gender;
    }
  }

  ngAfterViewInit(): void {
    $('age-start-select').val(this.ageStart);
    $('#age-end-select').val(this.ageEnd);
    $('#hornlength-start-select').val(this.hornlengthStart);
    $('#hornlength-end-select').val(this.hornlengthEnd);
    $('#gender-select').val(this.gender);

    this.search(0);
  }

  ngOnDestroy(): void {
    SearchComponent.bundleBackupData = {
      ages: this.ages,
      hornlengths: this.hornlengths,
      genders: this.genders,
      profileRows: this.profileRows,
      siteCurrent: this.siteCurrent,
      siteEnd: this.siteEnd,
      countAllProfiles: this.countAllProfiles,
      countPaginationButtons: this.countPaginationButtons,
      pageSize: this.PAGE_SIZE,
      ageStart: this.ageStart,
      ageEnd: this.ageEnd,
      hornlengthStart: this.hornlengthStart,
      hornlengthEnd: this.hornlengthEnd,
      gender: this.gender
    }
  }

  onAgeStartSelected(event: any): void {
    this.ageStart = event.target.value;
  }

  onAgeEndSelected(event: any): void {
    this.ageEnd = event.target.value;
  }

  onHornlengthStartSelected(event: any): void {
    this.hornlengthStart = event.target.value;
  }

  onHornlengthEndSelected(event: any): void {
    this.hornlengthEnd = event.target.value;
  }

  onGenderSelected(event: any): void {
    this.gender = event.target.value;
  }

  onLogoutClicked(): void {
    this.authService.logout();
  }

  onSearchNowButtonClicked(): void {
    // const $secondPageItem = $($('.footer').find('.page-item').get(1) as any);
    // $secondPageItem.addClass('active');
    this.search(0);
  }

  onPaginationPrevButtonClicked(): void {
    let siteNew: number;

    if (this.siteCurrent === 1) {
      siteNew = this.siteEnd;
    } else {
      siteNew = this.siteCurrent - 1;
    }

    this.search(siteNew - 1);
  }

  onPaginationNextButtonClicked(): void {
    let siteNew: number;

    if (this.siteCurrent === this.siteEnd) {
      siteNew = 1;
    } else {
      siteNew = this.siteCurrent + 1;
    }

    this.search(siteNew - 1);
  }

  onPaginationNumericButtonClicked(butt: HTMLElement, i: number): void {
    if (i === 3) {
      // butt: ...
      this.onPaginationNextButtonClicked();
      return;
    }

    if (this.siteCurrent !== i + 1) {
      this.search(i);
    }
  }

  private search(page: number) {
    const profileId: number = this.jwtRepo.getJwt()?.profileId as number;

    this.profileRepo.getProfilesByFilterCriterias(
      profileId,
      {
        ageStart: this.ageStart,
        ageEnd: this.ageEnd,
        hornlengthStart: this.hornlengthStart,
        hornlengthEnd: this.hornlengthEnd,
        gender: this.gender,
        page: page,
        pageSize: this.PAGE_SIZE
      } as SearchFilter).subscribe((searchResult: SearchResult | null) => {
        if (searchResult !== null) {
          this.profileRows = [];
          const photoNames: string[] = [];

          this.countAllProfiles = searchResult.countAllProfiles;
          this.siteEnd = Math.ceil(searchResult.countAllProfiles / this.PAGE_SIZE);

          for (let i = 0; i < searchResult.profilesPage.length; i++) {
            const profile = searchResult.profilesPage[i];

            if (i === 0 || i === this.PAGE_SIZE / 2) {
              this.profileRows.push({ profiles: [] });
            }

            this.profileRepo.getPhotosByProfileId(profile.id)
              .subscribe((photos: Photo[] | null): void => {
                if (photos !== null) {
                  for (let j = 0; j < photos.length; j++) {
                    const photo = photos[j];

                    if (photo.profilePhoto) {
                      this.profileRows[i < this.PAGE_SIZE / 2 ? 0 : 1].profiles.push({
                        profileId: profile.id,
                        photoName: photo.name,
                        nickname: profile.nickname,
                        age: Math.floor((Date.now() - Date.parse(profile.birthday)) / 1000 / 60 / 60 / 24 / 365),
                        hornlength: profile.hornlength
                      });

                      photoNames.push(photo.name);

                      break;
                    }
                  }
                }
              });
          }

          this.countPaginationButtons = [];

          for (let i = 1; i <= this.siteEnd && i <= 3; i++) {
            this.countPaginationButtons.push(i);
          }

          if (this.siteEnd > 3) {
            this.countPaginationButtons.push('...');
          }

          this.siteCurrent = page + 1;
          const sitePageButtonIndex = page <= 2 ? page : 3;

          $('#searchPage, .footer').find('.numeric-page-item, .active').removeClass('active');
          const $pageButtonItem = $($('#searchPage, .footer').find('.numeric-page-item').get(sitePageButtonIndex) as any);
          $pageButtonItem.addClass('active');

          const interv1 = setInterval((): void => {
            const countNumericButtons = this.countPaginationButtons.length;
            const countNumericButtonsNow = $('#searchPage, .footer').find('.numeric-page-item').length;

            if (countNumericButtons === countNumericButtonsNow) {
              $('#searchPage, .footer').find('.numeric-page-item, .active').removeClass('active');
              const $pageButtonItem = $($('#searchPage, .footer').find('.numeric-page-item').get(sitePageButtonIndex) as any);
              $pageButtonItem.addClass('active');

              clearInterval(interv1);
            }
          });

          const interv2 = setInterval((): void => {
            if (searchResult.profilesPage.length === photoNames.length) {
              photoNames.forEach((v: string, i: number) => {
                this.photoRepo.getPhotoByName(photoNames[i])
                  .subscribe((imgData: Blob | null) => {
                    if (imgData !== null) {
                      const $img = $(`#searchPage, .${photoNames[i]}`);
                      $img.attr('src', `${URL.createObjectURL(imgData)}`);
                    }
                  });
              });

              clearInterval(interv2);
            }
          });

        } else {
          this.siteEnd = 0;
        }
      });
  }
}
