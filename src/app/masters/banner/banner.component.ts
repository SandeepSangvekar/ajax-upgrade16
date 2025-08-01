import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { AccountService } from '@app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.less']
})
export class BannerComponent implements OnInit {
  @ViewChild('exampleModal', { static: true }) exampleModalRef: ElementRef;
  @ViewChild('closeButton') closeButton;
  variant = null;
  bannerData: any = [];
  p: number = 1;
  searchText;
  itemsPerPage = 50;
  form: FormGroup;
  submitted = false;
  loading = false;
  isEdit = false;
  id: string;
  isEditMode: boolean;
  showModal: boolean;
  isChecked;
  inActive = false;
  active = false;
  date = new Date();
  selectedRow : Number;
  setClickedRow : Function;
  status: any;
 // noSpacePattern="^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$";
noSpacePattern= "^[a-zA-Z0-9.]*$";

  result1: any;
  imageLink: string;
  selectedFile: File | null = null;
imageError: string = '';
@ViewChild('fileInput') fileInput: ElementRef;
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
 ) { 
      this.setClickedRow = function(index){
        this.selectedRow = index;
    }
 
    }

  ngOnInit() {
    this.createUserLOgs();
   this.getBannerData();

    this.form = this.formBuilder.group({
      appType: [null, Validators.required],
      bannerType: [null, Validators.required],
      image: [null, Validators.required],
    });

  }
  createUserLOgs(){
    let params={
        "loginName":JSON.parse(localStorage.getItem('user')).loginName,
        "module":"MASTER",
        "function":"Banner",
        "type":"web"
    }
    this.accountService.createUserlogs(params).subscribe((data) => {    
         this.status=data['status'];
         console.log("status",this.status);
      },
        error => {
          this.toastr.error(error);
        })
    }

  getBannerData() {
    this.inActive = false; // Start loader
    this.bannerData = [];
    this.accountService.getBanner()
      .pipe(first())
      .subscribe((res: any) => {
        if (res?.docs?.length) {
          this.bannerData = res.docs;
          // this.inActive = true; 
          console.log("Banner List:", this.bannerData);
        }else {
          this.toastr.warning("No banner data found.");
          // this.inActive = false;
        }
        this.inActive = true; // Stop loader in both cases
      },
      error => {
        this.toastr.error(error);
        this.inActive = true;
      });
  }
  
  showBanner(img: string) {
    this.inActive = false;
    this.imageLink = null;
    setTimeout(() => {
      this.imageLink = `${img}`;
    });
  }
  
  onDeleteBanner(id: string) {
    let result = window.confirm("Are you sure you want to delete the record?")
    if (result == true) {
      this.accountService.deleteBanner(id).subscribe((data) => {
        // this.deleteVar = data
        this.toastr.success('Banner deleted successfully');
        this.getBannerData()
      })
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;
    
  // Stop if form is invalid
  if (this.form.invalid) {
    console.log('Form invalid');
    return;
  }

  // If image not uploaded
  if (!this.selectedFile) {
    this.imageError = 'Image is required based on app type and dimension criteria.';
    this.toastr.warning(this.imageError);
    return;
  }

  // If image is invalid based on earlier dimension check
  if (this.imageError) {
    this.toastr.warning(this.imageError);
    return; 
  }
  console.log('Submitting form...');
    this.loading = true;
    if (this.isEditMode) {
      this.updateBanner(this.id);
    }
    else {
      this.createBanner();
    }
  }

  addBanner() {
    this.showModal = true;
    this.isEditMode = false;
    this.form.reset();
    this.submitted = false;

  }

onFileChange(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const appType = this.form.get('appType')?.value;

  // Require appType to be selected before image
  if (!appType) {
    this.toastr.warning('Please select App Type first before uploading image.');
    this.selectedFile = null;
    this.form.get('image')?.reset();
    this.fileInput.nativeElement.value = '';
    return;
  }

  const reader = new FileReader();
  const img = new Image();

  reader.onload = (e: any) => {
    img.src = e.target.result;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      let isValid = false;

      if (appType === 'mobile') {
        isValid = width >= 1280 && width <= 1380 && height >= 720 && height <= 820;
        this.imageError = isValid ? '' : 'Mobile image must be between 1280x720 and 1380x820.';
      }

      if (appType === 'web') {
        isValid = width >= 1100 && width <= 1280 && height >= 120 && height <= 140;
        this.imageError = isValid ? '' : 'Web image must be between 1100x120 and 1280x140.';
      }

      if (isValid) {
        this.selectedFile = file;
        this.form.patchValue({ image: file });
        this.form.get('image')?.updateValueAndValidity();
      } else {
        this.selectedFile = null;
        this.imageError && this.toastr.warning(this.imageError);
        this.form.get('image')?.reset();
        this.fileInput.nativeElement.value = '';
      }
    };
  };

  reader.readAsDataURL(file);
}


  createBanner() {
  const formData: any = new FormData();
  formData.append("bannerType", this.form.value.bannerType);
  formData.append("appType", this.form.value.appType);
  if (this.selectedFile) {
    formData.append("images", this.selectedFile);
    console.log('Attached image to formData:', this.selectedFile.name);
  }
    this.accountService.newBanner(formData)
      .pipe(first())
      .subscribe((response)=>{
        this.result1=response;
          if (this.result1.status == "200") {
          this.toastr.success('Banner added successfully');
          // this.router.navigate(['../'], { relativeTo: this.route });
          this.closeButton.nativeElement.click();
          this.getBannerData();
          }
          else{
            this.closeButton.nativeElement.click();
            this.toastr.error('Banner is already created');

          }
        },
        error => {
          this.toastr.error(error);
          this.loading = false;
        }
      );

  }

  update(event, index, id) {

    this.showModal = true;
    this.isEditMode = true;
    this.id = id;

    let ids = index;
    if (this.isEditMode) {

      this.accountService.getByIdVariant(this.id)
        .subscribe(variant => {
          this.variant = variant;
          this.form.patchValue(this.variant);

        });
    }
  }

  updateBanner(id) {
    this.form.controls['updatedBy'].setValue(JSON.parse(localStorage.getItem('user')).loginName);
    this.accountService.updateVariant(id, this.form.value)

      .subscribe(res => {
        this.toastr.success('Updated successfully');
        this.closeButton.nativeElement.click();
        this.getBannerData();
      },
        error => {
          this.toastr.error(error);
          this.loading = false;
          this.closeButton.nativeElement.click();
        }
      );
  }

}
