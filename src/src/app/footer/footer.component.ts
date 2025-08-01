import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { AccountService, AlertService } from "../_services";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.less"],
})
export class FooterComponent implements OnInit {
  @ViewChild("exampleModal", { static: true }) exampleModalRef: ElementRef;
  @ViewChild("closeButton") closeButton;
  returnData: any;
  form: FormGroup;
  showModal: boolean;
  loading = true;
  submitted = false;
  selectedRating = 0;
  stars = [
    {
      id: 1,
      icon: "star",
      class: "star-gray star-hover star",
    },
    {
      id: 2,
      icon: "star",
      class: "star-gray star-hover star",
    },
    {
      id: 3,
      icon: "star",
      class: "star-gray star-hover star",
    },
    {
      id: 4,
      icon: "star",
      class: "star-gray star-hover star",
    },
    {
      id: 5,
      icon: "star",
      class: "star-gray star-hover star",
    },
  ];
  up: any;
  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      // selectedRating: [0, Validators.required],
      comment: [""],
    });
  }
  get f() {
    return this.form.controls;
  }
  clear() {
    this.form.controls["comment"].setValue("");
    this.selectedRating = 0;
    this.stars = [
      {
        id: 1,
        icon: "star",
        class: "star-gray star-hover star",
      },
      {
        id: 2,
        icon: "star",
        class: "star-gray star-hover star",
      },
      {
        id: 3,
        icon: "star",
        class: "star-gray star-hover star",
      },
      {
        id: 4,
        icon: "star",
        class: "star-gray star-hover star",
      },
      {
        id: 5,
        icon: "star",
        class: "star-gray star-hover star",
      },
    ];
  }
  selectStar(value): void {
    this.stars.filter((star) => {
      if (star.id <= value) {
        star.class = "star-gold star";
      } else {
        star.class = "star-gray star";
      }
      return star;
    });

    this.selectedRating = value;
  }

  onSubmit() {
    debugger;
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    var params = {
      rating: this.selectedRating,
      comment: this.form.value.comment,
    };
    this.accountService.createRating(params).subscribe(
      (res) => {
        console.log(res);
        this.up = res;
        if (this.up.status == "success") {
          this.toastr.success("Feedback submitted successfully");
          this.clearAlert();
          this.closeButton.nativeElement.click();
          this.loading = false;

          // document.getElementById("closeBtn2").click();
        } else if (this.up.status == "Rating is required!") {
          this.toastr.error(this.up.status);
          this.clearAlert();
        }
      },
      (err) => {
        this.toastr.error(err);
        this.loading = false;
      }
    );
  }
  clearAlert() {
    setTimeout(() => {
      this.toastr.clear();
    }, 4000);
  }
}
