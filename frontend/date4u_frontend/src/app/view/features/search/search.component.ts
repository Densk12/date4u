import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Photo } from 'src/app/db/model/Photo';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';
import { ProfileRepositoryService } from 'src/app/db/repository/profile-repository/profile-repository.service';
import { SearchResult } from 'src/app/logic/borderclasses/SearchResult';
import { environment } from 'src/environments/environment';

// ng g c view/features/search

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

  // intern attributes
  private PAGE_SIZE = 8;
  private ageStart = 18;
  private ageEnd = 99;
  private hornlengthStart = 1;
  private hornlengthEnd = 30;
  private gender = 0;

  constructor(
    private profileRepo: ProfileRepositoryService,
    private jwtRepo: JwtRepositoryService
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
  }

  ngOnInit(): void {
    // $('footer').hide();
  }

  ngAfterViewInit(): void {
    $('#age-end-select').val(this.ageEnd);
    $('#hornlength-end-select').val(this.hornlengthEnd);

    this.search(0);
  }

  ngOnDestroy(): void {
    // $('footer').show();
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
    this.jwtRepo.removeJwt();
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
      }).subscribe((searchResult: SearchResult | null) => {
        if (searchResult !== null) {
          this.profileRows = [];

          this.siteEnd = Math.ceil(searchResult.countAllProfiles / this.PAGE_SIZE);

          for (let i = 0; i < this.PAGE_SIZE / 2; i++) {
            const profile = searchResult.profiles[i];

            if (i === 0) {
              this.profileRows.push({ profiles: [] });
            }

            this.profileRepo.getPhotosByProfileId(profile.id)
              .subscribe((photos: Photo[] | null): void => {
                if (photos !== null) {
                  for (let j = 0; j < photos.length; j++) {
                    const photo = photos[j];

                    if (photo.profilePhoto) {
                      this.profileRows[0].profiles.push({
                        photo: `${environment.apiURL}/photos/${photo.name}`,
                        nickname: profile.nickname,
                        age: Math.floor((Date.now() - Date.parse(profile.birthday)) / 1000 / 60 / 60 / 24 / 365),
                        hornlength: profile.hornlength
                      });

                      break;
                    }
                  }
                }
              });
          }

          for (let i = this.PAGE_SIZE; i < this.PAGE_SIZE; i++) {
            const profile = searchResult.profiles[i];

            if (i === this.PAGE_SIZE) {
              this.profileRows.push({ profiles: [] });
            }

            this.profileRepo.getPhotosByProfileId(profile.id)
              .subscribe((photos: Photo[] | null): void => {
                if (photos !== null) {
                  for (let j = 0; j < photos.length; j++) {
                    const photo = photos[j];

                    if (photo.profilePhoto) {
                      this.profileRows[1].profiles.push({
                        photo: `${environment.apiURL}/photos/${photo.name}`,
                        nickname: profile.nickname,
                        age: Math.floor((Date.now() - Date.parse(profile.birthday)) / 1000 / 60 / 60 / 24 / 365),
                        hornlength: profile.hornlength
                      });

                      break;
                    }
                  }
                }
              });
          }

          this.countPaginationButtons = [];

          for (let i = 1; i <= this.siteEnd; i++) {
            this.countPaginationButtons.push(i);
          }

          if (this.siteEnd > 3) {
            this.countPaginationButtons.push('...');
          }

          this.siteCurrent = page + 1;
          const sitePageButtonIndex = page <= 2 ? page : 3;

          $('#searchPage .footer').find('.numeric-page-item, .active').removeClass('active');
          const $pageButtonItem = $($('#searchPage .footer').find('.numeric-page-item').get(sitePageButtonIndex) as any);
          $pageButtonItem.addClass('active');

        } else {
          this.siteEnd = 0;
        }
      });
  }
}
