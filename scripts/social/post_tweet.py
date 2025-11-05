#!/usr/bin/env python3
"""
Post tweet to Twitter/X with image attachment
Usage: post_tweet.py <title> <category> <url> <tags> <learning_points> <image_path>
"""
import tweepy
import os
import sys


def create_question_hook(category):
    """Generate category-specific question hook"""
    category_lower = category.lower()
    
    if 'angular' in category_lower:
        return "❓ Want to master Angular fundamentals?"
    elif 'python' in category_lower:
        return "❓ Want to level up your Python skills?"
    elif 'java' in category_lower:
        return "❓ Ready to master Java programming?"
    elif 'javascript' in category_lower:
        return "❓ Want to become a JavaScript pro?"
    elif 'devops' in category_lower:
        return "❓ Want to master DevOps practices?"
    elif 'go' in category_lower or 'golang' in category_lower:
        return "❓ Ready to learn Go programming?"
    else:
        return f"❓ Want to learn {category}?"


def create_tweet_text(category, learning_points, url, tags):
    """Create tweet text using Pattern A format"""
    # Parse learning points
    points = [p.strip() for p in learning_points.split('|')][:3]
    
    # Create question hook
    question_hook = create_question_hook(category)
    
    # Build learning points text
    learning_text = "\n".join([f"→ {point}" for point in points])
    
    # Create hashtags
    hashtags = ' '.join([f'#{tag.strip().replace(" ", "")}' for tag in tags.split(',') if tag.strip()])
    
    # Create tweet text with Pattern A format
    tweet_text = f"""{question_hook}

{learning_text}

📖 Full tutorial: {url}

{hashtags}"""
    
    # Ensure tweet is under 280 characters
    if len(tweet_text) > 280:
        # Shorten learning points if needed
        short_points = [p[:40] + "..." if len(p) > 40 else p for p in points]
        learning_text = "\n".join([f"→ {point}" for point in short_points])
        
        tweet_text = f"""{question_hook}

{learning_text}

📖 {url}

{hashtags}"""
    
    return tweet_text


def main():
    if len(sys.argv) != 7:
        print("Usage: post_tweet.py <title> <category> <url> <tags> <learning_points> <image_path>")
        sys.exit(1)
    
    title = sys.argv[1]
    category = sys.argv[2]
    url = sys.argv[3]
    tags = sys.argv[4]
    learning_points = sys.argv[5]
    image_path = sys.argv[6]
    
    # Authenticate with Twitter API v1.1 (for media upload)
    auth = tweepy.OAuthHandler(
        os.environ['TWITTER_API_KEY'],
        os.environ['TWITTER_API_SECRET']
    )
    auth.set_access_token(
        os.environ['TWITTER_ACCESS_TOKEN'],
        os.environ['TWITTER_ACCESS_SECRET']
    )
    api_v1 = tweepy.API(auth)
    
    # Authenticate with Twitter API v2 (for posting tweets)
    client = tweepy.Client(
        consumer_key=os.environ['TWITTER_API_KEY'],
        consumer_secret=os.environ['TWITTER_API_SECRET'],
        access_token=os.environ['TWITTER_ACCESS_TOKEN'],
        access_token_secret=os.environ['TWITTER_ACCESS_SECRET']
    )
    
    # Upload image
    print(f"📤 Uploading image: {image_path}")
    media = api_v1.media_upload(filename=image_path)
    
    # Create tweet text
    tweet_text = create_tweet_text(category, learning_points, url, tags)
    
    print(f"📝 Tweet text ({len(tweet_text)} chars):\n{tweet_text}")
    print(f"🎯 Learning points included: {len(learning_points.split('|'))}")
    
    # Post tweet with image
    response = client.create_tweet(
        text=tweet_text,
        media_ids=[media.media_id]
    )
    
    print(f"✅ Tweet posted! ID: {response.data['id']}")
    print(f"🔗 https://twitter.com/infoyouth2019/status/{response.data['id']}")


if __name__ == "__main__":
    main()
