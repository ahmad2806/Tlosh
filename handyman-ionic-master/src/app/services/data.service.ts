import { Injectable } from '@angular/core';
import { SignPdfModel } from '../models/SignPdfModel'
import { AlertController, Platform } from '@ionic/angular';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Market } from '@ionic-native/market/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private imageUrl = '../../assets/pdf_icon.png';
  private name = 's';
  private m_date: string

  // public tloshs: [] = [];

  public signPdf: SignPdfModel[] = [];
  public tloshs: SignPdfModel[] = [];




  constructor(
    private platform: Platform, private document: DocumentViewer,
    private file: File, private transfer: FileTransfer,
    private fileOpener: FileOpener, private appAvailability: AppAvailability,
    private market: Market, private alertCtrl: AlertController) {
    this.fillData()
  }

  private getTloshs() {
    if (this.tloshs.length > 0) {
      return;
    }
    for (let i = 0; i < 5; ++i) {
      let tlosh_1 = new SignPdfModel(`${this.name}_${i} tlosh`, this.imageUrl, new Date(`${this.m_date}_ ${i}`), `${i}`);
      this.tloshs.push(tlosh_1);
    }
  }
  private getPdfFill() {
    if (this.signPdf.length > 0) {
      return;
    }
    for (let i = 0; i < 5; ++i) {
      let sign_1 = new SignPdfModel(`${this.name}_${i}`, this.imageUrl, new Date(`${this.m_date}_ ${i}`), `${i}`);
      this.signPdf.push(sign_1);
    }
  }

  public fillData() {
    this.getTloshs();
    this.getPdfFill();
  }







  private PDF_READER: string = "com.adobe.reader";
  private APP_NOT_FOUND: string = `please download adobe acrobat to ensure the best results\ndownlaod and come back to the app\n`
  private OPEN_APP: string = `please open the pdf using adobe acrobat to ensure the best results\n`

  private getLocalPath() {
    return this.file.applicationDirectory + 'www/assets';
  }
  private setPath() {
    let path = null;
    if (this.platform.is("ios")) {
      path = this.file.documentsDirectory;
    } else {
      path = this.file.dataDirectory;
    }
    return path;
  }
  private tryOpenPdf(url: string) {
    this.appAvailability.check(this.PDF_READER).then(
      (yes: boolean) => {

        // this.alertCtrl.create().then((alert) => {
        //   alert.title = `open`
        //   alert.subHeader = `${this.OPEN_APP}`;
        //   alert.buttons = ['Ok']

        //   alert.present().then(() => {
        //     this.fileOpener.open(url, 'application/pdf');
        //   });

        // });

        alert(`${this.OPEN_APP}`);
        this.fileOpener.open(url, 'application/pdf');
      },
      (no: boolean) => {
        // this.alertCtrl.create().then((alert) => {
        //   alert.title = `open`
        //   alert.subHeader = `${this.APP_NOT_FOUND}`;
        //   alert.buttons = ['Ok']

        //   alert.present().then(() => {
        //     this.market.open(this.PDF_READER);
        //   });

        // });

        alert(`${this.APP_NOT_FOUND}`);
        this.market.open(this.PDF_READER);
      }
    );
  }
  private startDownload(download_from_url: string, path: string, file_name: string) {
    const transfer = this.transfer.create();
    transfer.download(download_from_url, `${path}${file_name}`).then(entry => {
      let url = entry.toURL();

      if (this.platform.is("ios")) {
        this.document.viewDocument(url, 'application/pdf', {});
      } else {
        this.tryOpenPdf(url)
      }
    });
  }


  private copyAndOpenPdf(file_name: string, file_path: string) {
    if (this.platform.is('android')) {
      this.file.copyFile(file_path, file_name, this.file.dataDirectory, `${file_name}`).then(result => {
        // this.fileOpener.open(result.nativeURL, 'application/pdf');
        this.tryOpenPdf(result.nativeURL)
        // alert(`${result.nativeURL}  \n${file_path}/${file_name}\n${this.file.dataDirectory}/${file_name}\n${result}`);
      });
    } else {
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      }
      this.document.viewDocument(`${file_path}/${file_name}`, 'application/pdf', options);
    }
  }

  downloadAndOpenPdf() {
    const file_name = "tofs.pdf";
    // check internet connection
    let path = this.setPath();
    // const url = 'https://www.docdroid.net/file/download/caC6W0b/vfs-hshtlmvt.pdf';
    // const url = 'https://www.docdroid.net/eSQ6iOX/nhli-mshmt-svdnim-dmbr-2018.pdf';
    const url = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

    // this.file.checkFile(path, file_name).then(_ => alert(`file already exist in \n ${path}`)).catch(err => this.downloadAndOpenFile(url, path, file_name));
    path = this.startDownload(url, path, file_name)

  }

  loadLocalPdf() {
    // const url = 'https://www.docdroid.net/caC6W0b/vfs-hshtlmvt.pdf';
    this.copyAndOpenPdf('test.pdf', this.getLocalPath());
  }
  loadFillablePDF() {
    this.copyAndOpenPdf('test_fill.pdf', this.getLocalPath());
  }

  data = [
    {
      id: 1,
      verified: true,
      avatar:
        'https://images.unsplash.com/photo-1461938337379-4b537cd2db74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Uncle John',
      reviews: '72',
      distance: '149m',
      info:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum'
    },
    {
      id: 2,
      verified: false,
      avatar:
        'https://images.unsplash.com/photo-1534691157507-c2cb7d55102a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'The Pumbler Dude',
      reviews: '205',
      distance: '60m',
      info:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum'
    },
    {
      id: 3,
      verified: true,
      avatar:
        'https://images.unsplash.com/photo-1516962080544-eac695c93791?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Fix & Paint',
      reviews: '5',
      distance: '1km',
      info:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum'
    },
    {
      id: 4,
      verified: false,
      avatar:
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Home Decor Co.',
      reviews: '15',
      distance: '250m',
      info:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum'
    },
    {
      id: 5,
      verified: false,
      avatar:
        'https://images.unsplash.com/photo-1554178286-db408c69256a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Bill the Blacksmith',
      reviews: '23',
      distance: '50m',
      info:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum'
    },
    {
      id: 6,
      verified: true,
      avatar:
        'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Plug n Play Electronics',
      reviews: '1903',
      distance: '2km',
      info:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum'
    }
  ];

  reviews = [
    {
      avatar:
        'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      name: 'John Smith',
      rate: '5',
      text:
        'Amazing job. Well done, fast and clean. Is the best handyman and gentle dude to really help me solve my problem.'
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1567186937675-a5131c8a89ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      name: 'Matthew McDonald',
      rate: '4',
      text:
        'Amazing job. Well done, fast and clean. Is the best handyman and gentle dude to really help me solve my problem.'
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Sara Jenkins',
      rate: '4.5',
      text:
        'Amazing job. Well done, fast and clean. Is the best handyman and gentle dude to really help me solve my problem.'
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1551185887-26a932b61669?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Lara Dunkirk',
      rate: '5',
      text:
        'Amazing job. Well done, fast and clean. Is the best handyman and gentle dude to really help me solve my problem.'
    }
  ];

  appointments = [
    {
      avatar:
        'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Plug n Play Electronics',
      date: '26/02/2019',
      amount: '1005',
      text:
        'Keep close to Natures heart... and break clear away,once in awhile, and climb a mountain or spend...'
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Home Decor Co.',
      date: '05/06/2019',
      amount: '650',
      text:
        'Keep close to Natures heart... and break clear away,once in awhile, and climb a mountain or spend...'
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1516962080544-eac695c93791?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Fix & Paint',
      date: '12/10/2019',
      amount: '251.25',
      text:
        'Keep close to Natures heart... and break clear away,once in awhile, and climb a mountain or spend...'
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1461938337379-4b537cd2db74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
      name: 'Uncle John',
      date: '10/12/2019',
      amount: '132',
      text:
        'Keep close to Natures heart... and break clear away,once in awhile, and climb a mountain or spend...'
    }
  ];

  images = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1505798577917-a65157d3320a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=375&q=80'
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=375&q=80'
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1542013936693-884638332954?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80'
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1533775981670-bc3cc1f11868?ixlib=rb-1.2.1&auto=format&fit=crop&w=375&q=80'
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1458829267686-b15150d4a28e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=375&q=80'
    }
  ];

  cardInf = [
    {
      id: 1,
      name: 'Sign',
      url: 'assets/icons/policy.svg',
      color: 'green',
      role: 'user',
      routePage: '/sign-pdf/'
    },
    {
      id: 2,
      name: 'Tlush',
      url: 'assets/icons/pdf.svg',
      color: 'red',
      role: 'user',
      routePage: '/tlosh/'
    },
    {
      id: 3,
      name: 'Send',
      url: 'assets/icons/electrical.svg',
      color: 'blue',
      role: 'admin',
      routePage: '/category/' + 3
    },
    {
      id: 4,
      name: 'Documents',
      url: 'assets/icons/pet.svg',
      color: 'yellow',
      role: 'admin',
      routePage: '/category/' + 4
    },
    {
      id: 5,
      name: 'New User',
      url: 'assets/icons/newUser.svg',
      color: 'light-green',
      role: 'admin',
      routePage: '/category/' + 5
    },
    {
      id: 6,
      name: 'About',
      url: 'assets/icons/about.svg',
      color: 'black',
      role: 'user',
      routePage: '/category/' + 6

    }
  ];


  getData() {
    return this.data;
  }

  getImages() {
    return this.images;
  }

  getCategories() {
    return this.cardInf;
  }

  getReviews() {
    return this.reviews;
  }

  getAppointments() {
    return this.appointments;
  }

  getDataById(id: number) {
    return this.data.find((data: any) => data.id === id);
  }

  getCategoyById(id: number) {
    return this.cardInf.find((data: any) => data.id === id);
  }

  deleteData(id: number) {
    return (this.data = this.data.filter((data: any) => data.id !== id));
  }
}
