import MediaAdvertisingPageContent from './MediaAdvertisingPageContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Media Advertising India | TV, Radio, Print and OTT | ThinkSuite',
  description: 'Media advertising services in India: TV, radio, print, OTT, and digital media buying for regional and national campaigns. Cross-channel planning and media optimization.',
  keywords: ['media advertising India', 'TV advertising India', 'radio advertising India', 'print media advertising', 'OTT advertising India', 'programmatic advertising India', 'media buying agency India', 'integrated media planning', 'cross-channel advertising'],
}

export default function MediaAdvertisingPage() {
  return <MediaAdvertisingPageContent />
}
