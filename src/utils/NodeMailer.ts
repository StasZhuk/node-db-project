import nodemailer from 'nodemailer';
import { getEnvironmentVars } from '../environments';

const options = {
  service: 'gmail',
  auth: {
    user: getEnvironmentVars().nodemailerGmailAccount,
    pass: getEnvironmentVars().nodemailerGmailPassword,
  },
}

type SendEmaIlProps = {
  from?: string;
  to: Array<string>;
  subject: string;
  html: string;
}

class NodeMailer {
  private static instance

  constructor() {
    if (!NodeMailer.instance) {
      NodeMailer.instance = NodeMailer.getInstance()
    }
  }

  private static getInstance() {
    return nodemailer.createTransport(options)
  }

  async sendEmail(props: SendEmaIlProps) {
    return NodeMailer.instance.sendMail({
      from: props.from || getEnvironmentVars().nodemailerGmailAccount,
      to: props.to,
      subject: props.subject,
      html: props.html,
    }, (err, res) => {
      if (err) {
        console.log("send email error", err)
      }
      console.log("send email success", res);
    });
  }
}

export default new NodeMailer()
