import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {MatListModule} from '@angular/material';
import {SectionService} from '../../../providers/section.service'
import {ContentService }from '../../../providers/content.service'
import {AppProvider} from '../../../providers/app.provider'

@Component({
  selector: 'app-suggest-article-dialog',
  templateUrl: './suggest-article-dialog.component.html',
  styleUrls: ['./suggest-article-dialog.component.scss'],
  providers:[SectionService,ContentService]
})
export class SuggestArticleDialogComponent implements OnInit {
  waitLoader:boolean;
  addContentRequest;
  sections:any;
  categories:any;
  subCategories:any;
  suggestedArticalList:any;
  suggestedArticalListBackup:any;
  filter:any;
  constructor(private dialog: MatDialog, public dialogRef: MatDialogRef<SuggestArticleDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
            private sectionService:SectionService,
            private appProvider: AppProvider,
            private contentProvider:ContentService) { 
      this.addContentRequest={}
  }

  ngOnInit() {
  	this.getSectionList()
  }

  onClosed(){
  	this.dialogRef.close();
  }

 getSectionList(){
                this.sectionService.onGetSection()
              .subscribe(data => {
                  this.waitLoader = false;
                  this.sections=data;
              },error=>{
                  alert(error)
              })
  }
  getCategory(){
         this.sectionService.onGetCategory(this.addContentRequest.sectionId)
                .subscribe(data => {
                    this.waitLoader = false;
                    this.categories=data.response;
                    console.log(JSON.stringify(data))
                },error=>{
                    alert(error)
                }) 
    }
   getsubCategory(){
     this.sectionService.onGetSubCategory(this.addContentRequest.sectionId,this.addContentRequest.categoryId)
                .subscribe(data => {
                    this.waitLoader = false;
                    this.subCategories=data.response;
                    console.log(JSON.stringify(data))
                },error=>{
                    alert(error)
                }) 
   }
   getSuggestedArtical(){
      this.contentProvider.ongetSuggestedArticle(this.addContentRequest)
                .subscribe(data => {
                    this.waitLoader = false;
                    this.suggestedArticalList=data.response;
                    this.suggestedArticalListBackup=data.response;
                },error=>{
                    alert(error)
                })
   }
   saveSuggestedArticle(){
     let filtredArticle=this.suggestedArticalList.filter(arg=>arg.check==true)
     this.dialogRef.close(filtredArticle)
   }
   onsearcArticle(article){
      // alert(searchUser)
      if (article == '') {
            this.suggestedArticalList = this.suggestedArticalListBackup;
            return;
       }
       let ev= article
       if (ev && ev.trim() != '') {
        this.suggestedArticalList = this.suggestedArticalListBackup.filter((value) => {
          if (!value.sectionName && value.categoryName && value.subCategoryName && value.headline ) {
            return (
              value.sectionName.toUpperCase().indexOf(ev.toUpperCase()) > -1 
              || value.categoryName.toUpperCase().indexOf(ev.toUpperCase()) > -1 
              || value.subCategoryName.toUpperCase().indexOf(ev.toUpperCase()) > -1 
              || value.headline.toUpperCase().indexOf(ev.toUpperCase()) > -1
              
              );
          }else if ( !value.sectionName && value.categoryName && value.subCategoryName && value.headline ) {
            return (
               value.categoryName.toUpperCase().indexOf(ev.toUpperCase()) > -1 
              || value.subCategoryName.toUpperCase().indexOf(ev.toUpperCase()) > -1 
              || value.headline.toUpperCase().indexOf(ev.toUpperCase()) > -1
              
              );
          }else if (!value.sectionName && !value.categoryName && value.subCategoryName && value.headline ) {
            return (
              value.subCategoryName.toUpperCase().indexOf(ev.toUpperCase()) > -1 
              || value.headline.toUpperCase().indexOf(ev.toUpperCase()) > -1
              
              );
          }else if ( !value.sectionName && !value.categoryName && !value.subCategoryName && value.headline ) {
            return (
              value.headline.toUpperCase().indexOf(ev.toUpperCase()) > -1
              
              );
          }
            
          
       })
      }
    }
}
