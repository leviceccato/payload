import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { MediaCollection } from './collections/Media/index.js'
import { PagesCollection, pagesSlug } from './collections/Pages/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, PagesCollection, MediaCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor({}),
  globals: [
    // ...add more globals here
    MenuGlobal,
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    await Promise.all(
      Array.from({ length: 15 }, (_, index) =>
        payload.create({
          collection: postsSlug,
          data: {
            title: `Post ${index}`,
          },
        }),
      ),
    )

    await Promise.all(
      Array.from({ length: 15 }, (_, index) =>
        payload.create({
          collection: pagesSlug,
          data: {
            title: `Page ${index}`,
          },
        }),
      ),
    )
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
