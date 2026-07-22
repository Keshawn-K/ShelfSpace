from django.core.management.base import BaseCommand
from api.models import MediaType, Genre, MediaItem


class Command(BaseCommand):
    help = 'Seed the database with sample media data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Create media types
        media_types = ['Book', 'Movie', 'Game', 'Music']
        for mt_name in media_types:
            MediaType.objects.get_or_create(name=mt_name)

        # Create genres
        genres = [
            'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
            'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
            'Non-Fiction', 'Biography', 'Self-Help', 'History'
        ]
        for g_name in genres:
            Genre.objects.get_or_create(name=g_name)

        # Get references
        book_type = MediaType.objects.get(name='Book')
        movie_type = MediaType.objects.get(name='Movie')
        game_type = MediaType.objects.get(name='Game')
        music_type = MediaType.objects.get(name='Music')

        sci_fi = Genre.objects.get(name='Sci-Fi')
        fantasy = Genre.objects.get(name='Fantasy')
        drama = Genre.objects.get(name='Drama')
        action = Genre.objects.get(name='Action')
        non_fiction = Genre.objects.get(name='Non-Fiction')
        biography = Genre.objects.get(name='Biography')
        mystery = Genre.objects.get(name='Mystery')
        thriller = Genre.objects.get(name='Thriller')

        # Sample media items
        media_items = [
            {
                'title': 'The Hobbit',
                'creator': 'J.R.R. Tolkien',
                'media_type': book_type,
                'genre': fantasy,
                'year': 1937,
                'description': 'A fantasy novel about the journey of Bilbo Baggins.',
            },
            {
                'title': 'Dune',
                'creator': 'Frank Herbert',
                'media_type': book_type,
                'genre': sci_fi,
                'year': 1965,
                'description': 'A science fiction epic set on the desert planet Arrakis.',
            },
            {
                'title': 'The Dark Knight',
                'creator': 'Christopher Nolan',
                'media_type': movie_type,
                'genre': action,
                'year': 2008,
                'description': 'Batman faces the Joker in Gotham City.',
            },
            {
                'title': 'Inception',
                'creator': 'Christopher Nolan',
                'media_type': movie_type,
                'genre': sci_fi,
                'year': 2010,
                'description': 'A thief who steals corporate secrets through dream-sharing technology.',
            },
            {
                'title': 'The Witcher 3: Wild Hunt',
                'creator': 'CD Projekt Red',
                'media_type': game_type,
                'genre': fantasy,
                'year': 2015,
                'description': 'An open-world action RPG following Geralt of Rivia.',
            },
            {
                'title': 'Red Dead Redemption 2',
                'creator': 'Rockstar Games',
                'media_type': game_type,
                'genre': action,
                'year': 2018,
                'description': 'An epic tale of life in America at the dawn of the modern age.',
            },
            {
                'title': 'Abbey Road',
                'creator': 'The Beatles',
                'media_type': music_type,
                'genre': drama,
                'year': 1969,
                'description': 'The eleventh studio album by the English rock band.',
            },
            {
                'title': 'To Kill a Mockingbird',
                'creator': 'Harper Lee',
                'media_type': book_type,
                'genre': drama,
                'year': 1960,
                'description': 'A novel about the serious issues of rape and racial inequality.',
            },
            {
                'title': 'The Shawshank Redemption',
                'creator': 'Frank Darabont',
                'media_type': movie_type,
                'genre': drama,
                'year': 1994,
                'description': 'Two imprisoned men bond over a number of years.',
            },
            {
                'title': 'Sapiens: A Brief History of Humankind',
                'creator': 'Yuval Noah Harari',
                'media_type': book_type,
                'genre': non_fiction,
                'year': 2011,
                'description': 'A book exploring the history of the human species.',
            },
            {
                'title': 'The Last of Us',
                'creator': 'Naughty Dog',
                'media_type': game_type,
                'genre': thriller,
                'year': 2013,
                'description': 'A post-apocalyptic action-adventure game.',
            },
            {
                'title': 'Becoming',
                'creator': 'Michelle Obama',
                'media_type': book_type,
                'genre': biography,
                'year': 2018,
                'description': 'The memoir of former First Lady Michelle Obama.',
            },
        ]

        for item_data in media_items:
            MediaItem.objects.get_or_create(
                title=item_data['title'],
                defaults=item_data
            )

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))