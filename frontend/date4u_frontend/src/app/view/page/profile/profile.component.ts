import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { JwtRepositoryService } from 'src/app/db/repository/jwt-repository/jwt-repository.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ProfileRepositoryService } from 'src/app/db/repository/profile-repository/profile-repository.service';
import { Photo } from 'src/app/db/model/Photo';
import { PhotoRepositoryService } from 'src/app/db/repository/photo-repository/photo-repository.service';
import { Profile } from 'src/app/db/model/Profile';
import { AuthService } from 'src/app/business_logic/service/auth/auth.service';
import { DialogViewService } from '../../service/dialog-view/dialog-view.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  // template attributes
  hornlengths: Array<number> = [];
  genders: Array<string> = ['Weiblich', 'Männlich', 'Divers'];
  images: Array<Photo> = [];
  nickname = '';
  hornlength = 1;
  gender = 0;
  attractedToGender = 0;
  description = '';
  birthday = '';
  isOwnProfile = false;
  attributesChanged = false;
  profileId = 0;

  // intern attributes
  private profileIdTransfered = 0;
  private datePicker: any;
  private carousel: bootstrap.Carousel | undefined;
  private photoUpload: File | undefined;
  private profile: Profile | undefined;
  @ViewChild('datePickerInput') private datePickerInputRef: ElementRef | any;
  @ViewChild('nicknameInput') private nicknameInputRef: ElementRef | any;
  @ViewChild('descriptionTextarea') private descriptionTextareaRef: ElementRef | any;
  @ViewChild('carousel') private carouselRef: ElementRef | any;
  @ViewChild('saveButton') private saveButtonRef: ElementRef | any;

  constructor(
    private jwtRepo: JwtRepositoryService,
    private route: ActivatedRoute,
    private profileRepo: ProfileRepositoryService,
    private photoRepo: PhotoRepositoryService,
    private authService: AuthService,
    private dialogView: DialogViewService
  ) {
    this.hornlengths = Array.from({ length: 30 }, (_, i) => i + 1);
    this.birthday = this.formatDate(new Date());

    this.route.params.subscribe((pathParams: Params): void => {
      this.profileIdTransfered = pathParams['id'];
      this.profileId = this.jwtRepo.getJwt()?.profileId as any;
      this.isOwnProfile = this.profileId == this.profileIdTransfered;
      this.loadImages();
      this.loadProfile();
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $(this.nicknameInputRef.nativeElement).on('change keydown paste input propertychange keyup blur', this.onInputNicknameChanged.bind(this));
    $(this.descriptionTextareaRef.nativeElement).on('change keydown paste input propertychange keyup blur', this.onTextareaDescriptionChanged.bind(this));
  }

  onLogoutClicked(): void {
    this.authService.logout();
  }

  onDatepickerInputClicked(): void {
    this.datePicker.show();
  }

  onHornlengthSelected(): void {
    this.attributesChanged = true;
  }

  onGenderSelected(): void {
    this.attributesChanged = true;
  }

  onAttractedToGenderSelected(): void {
    this.attributesChanged = true;
  }

  onTextareaDescriptionChanged(): void {
    this.attributesChanged = true;
  }

  onInputNicknameChanged(): void {
    this.attributesChanged = true;
  }

  onPrevCarouselButtonClicked(): void {
    this.carousel?.prev();
  }

  onNextCarouselButtonClicked(): void {
    this.carousel?.next();
  }

  onInputPhotoAddClicked(event: any): void {
    this.photoUpload = event.target.files[0];
    this.attributesChanged = true;
  }

  onLikeClicked(like: HTMLElement): void {
    if ($(like).hasClass('animated')) {
      this.profileRepo.createLikedProfileByProfileId(
        this.jwtRepo.getJwt()?.profileId as any,
        this.profileIdTransfered
      ).subscribe((success: boolean): void => {
        if (success) {
          $(like).attr('class', 'fa-solid fa-thumbs-up');
        }
      });
    } else {
      this.profileRepo.deleteProfileLiked(
        this.jwtRepo.getJwt()?.profileId as any,
        this.profileIdTransfered
      ).subscribe((success: boolean): void => {
        if (success) {
          $(like).attr('class', 'fa-regular fa-thumbs-up animated');
        }
      });
    }
  }

  onDeleteProfileButtonClicked(): void {
    this.dialogView.showModalAccountDeletion((modal: bootstrap.Modal): void => {
      this.profileRepo.deleteProfileById(this.profileId)
      .subscribe((success: boolean): void => {
        modal.hide();
        
        if (success) {
          this.authService.logout();
        }
      });
    });
  }

  onSaveButtonClicked(): void {
    const $saveButton = $(this.saveButtonRef.nativeElement);

    if ($saveButton.find('div').hasClass('d-none')) {
      $saveButton.find('div').removeClass('d-none');

      this.profileRepo.updateProfileById(
        this.profileId,
        {
          id: this.profileId,
          nickname: this.nickname,
          birthday: this.birthday,
          hornlength: this.hornlength,
          gender: this.gender,
          attractedToGender: this.attractedToGender,
          description: this.description
        } as Profile
      ).subscribe((success: boolean): void => {
        setTimeout((): void => {
          $saveButton.find('div').addClass('d-none');
          this.attributesChanged = false;
        }, 1000);
      });

      if (this.photoUpload !== undefined) {
        this.profileRepo.createPhotoByProfileId(this.profileId, this.photoUpload, false)
          .subscribe((success: boolean): void => {
            if (success) {
              this.photoUpload = undefined;
              this.loadImages();
            }
          });
      }
    }
  }

  private loadImages(): void {
    this.profileRepo.getPhotosByProfileId(this.profileIdTransfered)
      .subscribe((photos: Photo[] | null): void => {
        if (photos !== null) {
          const photoSorted: Photo[] = [];

          for (let i = 0; i < photos.length; i++) {
            if (photos[i].profilePhoto) {
              photoSorted.push(photos[i]);
              break;
            }
          }

          for (let i = 0; i < photos.length; i++) {
            if (!photos[i].profilePhoto) {
              photoSorted.push(photos[i]);
            }
          }

          this.images = photoSorted;

          const interv = setInterval((): void => {
            if (photos.length === $(this.carouselRef.nativeElement).find('img').length) {
              photoSorted.forEach((p: Photo): void => {
                this.photoRepo.getPhotoByName(p.name)
                  .subscribe((imageBlob: Blob | null): void => {
                    if (imageBlob !== null) {
                      const $img = $(`#profile-comp, .${p.name}`);
                      $img.attr('src', `${URL.createObjectURL(imageBlob)}`);
                    }
                  });
              });

              this.initCarousel();
              clearInterval(interv);
            }
          });
        }
      });
  }

  private loadProfile(): void {
    this.profileRepo.getProfileById(this.profileIdTransfered)
      .subscribe((profile: Profile | null): void => {
        if (profile !== null) {
          this.profile = profile;

          this.initDatePicker(profile.birthday);
          this.hornlength = profile.hornlength;
          this.gender = profile.gender;
          this.attractedToGender = profile.attractedToGender;
          this.description = profile.description;
          this.nickname = profile.nickname;

          if (!this.isOwnProfile) {
            this.profileRepo.getProfilesLikedByProfileId(this.jwtRepo.getJwt()?.profileId as any)
              .subscribe((profilesLiked: Profile[] | null): void => {
                if (profilesLiked !== null) {
                  for (let i = 0; i < profilesLiked.length; i++) {
                    if (profilesLiked[i].id == this.profileIdTransfered) {
                      $('#profile-comp')
                        .find('.like-container')
                        .find('i')
                        .attr('class', 'fa-solid fa-thumbs-up');

                      break;
                    }
                  }
                }
              });
          }
        }
      });
  }

  private initDatePicker(birthday: string): void {
    this.birthday = birthday;

    $(this.datePickerInputRef.nativeElement).on('change keydown paste input propertychange keyup blur', (): void => {
      if (this.birthday === '') {
        this.birthday = this.profile?.birthday as any;
      }
    });
  }

  private initCarousel(): void {
    this.carousel = new bootstrap.Carousel(this.carouselRef.nativeElement, {
      interval: 1000,
      wrap: true,
      touch: true
    });

    $(this.carouselRef.nativeElement).find('.carousel-item').first().attr('class', 'carousel-item active');
  }

  private formatDate(date: any) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

}
