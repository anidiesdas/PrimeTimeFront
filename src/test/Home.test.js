import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import Home from '@/components/Home.vue'

vi.mock('@/utils/genre.js', () => ({
    genreMap: {
        28: 'Action',
        35: 'Comedy',
        18: 'Drama'
    }
}))

vi.mock('@/utils/timeComparisons.js', () => ({
    getRandomComparison: vi.fn(() => 'That\'s like watching <strong>Titanic</strong> 2 times!')
}))

// Mock fetch globally
global.fetch = vi.fn()

describe('Home', () => {
    beforeEach(() => {
        fetch.mockClear()

        // Default-Mock
        fetch.mockImplementation(() =>
            Promise.resolve({
                ok: true,
                json: vi.fn().mockResolvedValue({
                    totalMoviesWatched: 0,
                    monthName: 'Test',
                    bestRatedMovie: 'Best Movie',
                    worstRatedMovie: 'Worst Movie',
                    topGenres: [],
                    totalRuntime: 0,
                    results: []
                })
            })
        )
    })

    test('should convert genre IDs to names correctly', () => {
        const wrapper = mount(Home, {
            global: {
                stubs: {
                    'router-link': {
                        template: '<a><slot /></a>'
                    },
                    'StatusCounts': true
                }
            }
        })

        const genreNames = wrapper.vm.getGenreNames([28, 35, 999])
        expect(genreNames).toBe('Action, Comedy')
    })

    test('should generate correct poster URL', () => {
        const wrapper = mount(Home, {
            global: {
                stubs: {
                    'router-link': {
                        template: '<a><slot /></a>'
                    },
                    'StatusCounts': true
                }
            }
        })

        const posterUrl = wrapper.vm.getPosterUrl('/test-poster.jpg')
        expect(posterUrl).toBe('https://image.tmdb.org/t/p/w500/test-poster.jpg')

        const emptyUrl = wrapper.vm.getPosterUrl(null)
        expect(emptyUrl).toBe('')
    })
})