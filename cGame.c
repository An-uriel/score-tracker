#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <time.h>

#ifdef _WIN32
    #define CLEAR "cls"
#else
    #define CLEAR "clear"
#endif

#define MAX_WORDS 20
#define EASY_TIME 120
#define MEDIUM_TIME 180
#define HARD_TIME 300

// Room structure
struct Room {
    char hint[100];
    char word[20];
};

void shuffleWord(char* word, char* shuffled) {
    strcpy(shuffled, word);
    int len = strlen(shuffled);
    for (int i = 0; i < len - 1; i++) {
        int j = i + rand() % (len - i);
        char temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
}

void drawBoxTop() {
    printf("+------------------------------------------+\n");
}

void drawBoxBottom() {
    printf("+------------------------------------------+\n");
}

void playGame(struct Room rooms[], int count, int levelTimeLimit) {
    char guess[20], jumbled[20];
    int score = 0;
    time_t start, current;
    double timeTaken;

    start = time(NULL);

    for (int i = 0; i < count;) {
        system(CLEAR);

        current = time(NULL);
        timeTaken = difftime(current, start);

        if (timeTaken >= levelTimeLimit) {
            printf("==========================================\n");
            printf("    TIME'S UP! The ruins sealed shut.\n");
            printf("==========================================\n");
            break;
        }

        shuffleWord(rooms[i].word, jumbled);

        drawBoxTop();
        printf("|         TREASURE HUNT: AREA %02d           |\n", i + 1);
        drawBoxBottom();

        printf("Clue:           %s\n", rooms[i].hint);
        printf("Scrambled Word: %s\n", jumbled);
        printf("Time Left:      %.0f seconds\n", levelTimeLimit - timeTaken);
        printf("Progress:       %d / %d chests unlocked\n", score, count);
        printf("------------------------------------------\n");
        printf("Enter your guess: ");
        scanf("%s", guess);

        current = time(NULL);
        timeTaken = difftime(current, start);

        if (strcmp(guess, rooms[i].word) == 0) {
            printf("\n[✓] Correct! You unlocked the chest in Area %02d.\n", i + 1);
            score++;
            i++;
        } else {
            if (timeTaken >= levelTimeLimit) {
                printf("\n[!] Time ran out while solving.\n");
                break;
            }
            printf("\n[X] Wrong! Try again.\n");
        }

        for (volatile long wait = 0; wait < 100000000; wait++);
    }

    printf("\n==========================================\n");
    printf("            HUNTING COMPLETE\n");
    printf("     Total Chests Unlocked: %d / %d\n", score, count);
    printf("==========================================\n");
}

int main() {
    srand(time(NULL));

    struct Room easy[MAX_WORDS] = {
        {"What you always ask in class", "pen"},
        {"Your ride to school", "jeepney"},
        {"You drink this to survive 7 AM classes", "coffee"},
        {"Classic group chat platform", "messenger"},
        {"College student's best friend during finals", "notes"},
        {"Where you scroll during boring lectures", "tiktok"},
        {"Where your professor posts the modules", "canvas"},
        {"When you're too sleepy and you can't focus", "nap"},
        {"Used to pay food when you have no cash", "gcash"},
        {"Your cheap everyday meal", "noodles"},
        {"Guards won't let you in if you don't have this", "id"},
        {"Used to take class selfies or record the board", "phone"},
        {"Used to copy notes during class", "notebook"},
        {"Worn to avoid facial recognition in attendance", "mask"},
        {"You type on this during projects", "keyboard"},
        {"You pretend your cam is broken during", "camera"},
        {"Your grade depends on this during orals", "mic"},
        {"The only thing you can afford during finals week", "fare"},
        {"Your motivation to graduate", "diploma"},
        {"What you hold when your groupmates disappear", "stress"}
    };

    struct Room medium[MAX_WORDS] = {
        {"Google search alternative (rarely use)", "brain"},
        {"It carries your whole semester", "chatgpt"},
        {"Online class attendance proof", "screenshot"},
        {"Final exam enemy", "procrastination"},
        {"You don't consider to buy this", "yellowpad"},
        {"Keeps your group together (sometimes)", "gc"},
        {"PN Student ever need in projects", "extension"},
        {"What you lose during long lectures", "focus"},
        {"Place where you eat with tropa", "barracks"},
        {"Where you dump your emotional breakdown", "shower"},
        {"Every org meeting starts with a", "prayer"},
        {"You fake being 'unstable' to avoid recitation", "signal"},
        {"What you scream before deadlines", "help"},
        {"The real reason for late submissions", "wifi"},
        {"Where you love to wait for your next class", "library"},
        {"What you have limited access to", "phone"},
        {"Your everyday walk from gate to 4th floor", "stairs"},
        {"What we don't want to have", "consequences"},
        {"They are a lot in the center", "violators"},
        {"The most used excuse", "traffic"}
    };

    struct Room hard[MAX_WORDS] = {
        {"Mother of all circuits", "motherboard"},
        {"Converts code to binary", "compiler"},
        {"Where data is temporarily stored", "randomaccessmemory"},
        {"Permanent storage of files", "harddrive"},
        {"Handles internet connections", "router"},
        {"Brain of the computer", "processor"},
        {"Where your software runs", "operatingsystem"},
        {"Code-breaking language", "assembly"},
        {"Used for frontend styling", "cascadingstylesheet"},
        {"Used for structuring websites", "hypertextmarkuplangauge"},
        {"Programming for logic and conditions", "javascript"},
        {"Stores code versions online", "github"},
        {"Computer's visual output", "monitor"},
        {"You use this to click things", "mouse"},
        {"Allows multiple devices to connect", "switch"},
        {"Where the OS is stored", "solidstatedrive"},
        {"Shortcut key to refresh", "f5"},
        {"Malware that locks your files", "ransomware"},
        {"Fixes bugs", "patch"},
        {"Most common app used for IT student", "visualstudiocode"}
    };

    int choice;
    char playAgain;

    while (1) {
        system(CLEAR);
        printf("==========================================\n");
        printf("       PIXEL TREASURE HUNT: Z-EDITION      \n");
        printf("==========================================\n");
        printf("Select a difficulty level:\n");
        printf("1. Easy College Edition (2 mins)\n");
        printf("2. Meduim PNStudent Trials (3 mins)\n");
        printf("3. Computer Tech Dungeon (5 mins)\n");
        printf("4. Exit\n");
        printf("------------------------------------------\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);

        if (choice == 4) {
            printf("Exiting game. Goodbye, explorer.\n");
            break;
        }

        switch (choice) {
            case 1:
                playGame(easy, MAX_WORDS, EASY_TIME);
                break;
            case 2:
                playGame(medium, MAX_WORDS, MEDIUM_TIME);
                break;
            case 3:
                playGame(hard, MAX_WORDS, HARD_TIME);
                break;
            default:
                printf("Invalid choice. Returning to menu.\n");
                break;
        }

        printf("\nReturn to main menu? (y/n): ");
        scanf(" %c", &playAgain);
        if (playAgain != 'y' && playAgain != 'Y') {
            printf("\nExiting game. Goodbye, explorer.\n");
            break;
        }
    }

    return 0;
}
