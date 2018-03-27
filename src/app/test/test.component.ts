import { OnInit, Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AwsSignatureInputData } from '../aws/aws-signature-input.model';
import { AwsSignature } from '../aws/aws-signature';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.css']
})
export class TestSkillComponent implements OnInit {
    client_access_key: string = '39d565f4983246caa953080774e95a86';
    request: any = { query: '', alexa: '', apiai: '' };
    response: any = { alexa: '', apiai: '' };
    queryForm: FormGroup;
    lexFlag: boolean = false;
    dialogFlowFlag: boolean = false;

    constructor(private http: HttpClient, private awsSignature: AwsSignature) {
    }

    ngOnInit() {
        this.queryForm = new FormGroup({
            'query': new FormControl(null, Validators.required)
        });
    }


    sendDialogFlow() {
        console.log(this.queryForm);
        let query = this.queryForm.value.query;
        let headers = {
            "Authorization": `Bearer ${this.client_access_key}`
        }
        let httpHeader = new HttpHeaders(headers);
        let apiAiUrl = `https://lgp4j6q0kc.execute-api.us-east-1.amazonaws.com/dev?v=20180309&query=${query}&lang=en&sessionId=1234`;
        this.request.apiai = `\n\nDialogFlow Request:\t \n \n${apiAiUrl}`;
        
        this.http.get(apiAiUrl, { headers: httpHeader }).subscribe((res: any) => {
            //console.log("Success:" + JSON.stringify(res, null, 2));
            let speechText = res.result.fulfillment.speech;
            let data: any = {};
            try {
                data = JSON.parse(speechText);
                if (data.type) {
                    speechText = data.text;
                }
            } catch (error) {
                console.log('Cannot parse speechText since it is not a json string');
            }
            this.response.apiai = res;
            this.queryForm.reset();
        }, err => {
            console.log("Error" + JSON.stringify(err, null, 2));
        });

        this.sendAlexa();
    }


    sendAlexa() {
        let input = this.queryForm.value.query;
        console.log("Request Alexa",input);
        let authorization = this.getAuthorizationHeader({ "inputText": input });
        let headers = new HttpHeaders(authorization);

        let apiAlexaUrl = `https://runtime.lex.us-east-1.amazonaws.com/bot/EzipLexBot/alias/ezipLexBot/user/dummyuser/text`;
        this.request.alexa = `\n\nAlexa Request: \n \n${apiAlexaUrl}`;
        this.http.post(apiAlexaUrl, { 'inputText': input }, { headers: headers }).subscribe((res: any) => {
            this.response.alexa = res;
            console.log('Alexa Res',res);
            this.queryForm.reset();
        }, err => {
            console.log("Error", err);
        });

    }

    getAuthorizationHeader(requestBody: any): any {
        let awsSignatureInputData = new AwsSignatureInputData();

        awsSignatureInputData.method = 'POST';
        awsSignatureInputData.canonicalUri = '/bot/EzipLexBot/alias/ezipLexBot/user/dummyuser/text';
        awsSignatureInputData.host = 'runtime.lex.us-east-1.amazonaws.com';
        awsSignatureInputData.region = 'us-east-1';
        awsSignatureInputData.service = 'lex';
        awsSignatureInputData.accessKey = 'AKIAIAQRC3ZWYZX3RAEA';
        awsSignatureInputData.secretKey = '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';
        awsSignatureInputData.contentType = 'application/json';
        awsSignatureInputData.requestParameters = JSON.stringify(requestBody);
        awsSignatureInputData.canonicalQuerystring = '';
        return this.awsSignature.generateSignature(awsSignatureInputData);

    }
}