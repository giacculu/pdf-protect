import fs from 'fs'
import signer from 'node-signpdf'
import { plainAddPlaceholder } from 'node-signpdf/dist/helpers'

const [ , , input, output ] = process.argv
if(!input || !output) throw new Error('input output required')

const p12Path = process.env.SIGN_P12_PATH
const p12Pass = process.env.SIGN_P12_PASS || ''
if(!p12Path) throw new Error('SIGN_P12_PATH missing')

const pdfBuffer = fs.readFileSync(input)
const p12Buffer = fs.readFileSync(p12Path)

const pdfWithPlaceholder = plainAddPlaceholder({pdfBuffer, reason: 'Signed', signatureLength: 8192})
const signedPdf = signer.sign(pdfWithPlaceholder, p12Buffer, {passphrase: p12Pass})
fs.writeFileSync(output, signedPdf)
