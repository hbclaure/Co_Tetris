#!/usr/bin/env python
# coding: utf-8

# In[223]:


import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import mplcursors
import plotly as px
import plotly.express as px
import plotly.graph_objects as go
import seaborn as sns
from plotly.subplots import make_subplots


# In[13]:


# Setup: Create dataframe
df = pd.read_csv("./samples/third/source.csv")
df

# In[3]


def difference(lst):
    lst2 = [lst[0]]

    for x in range(0, len(lst)-1):
        lst2.append(lst[x+1]-lst[x])

    return lst2


# In[228]:


def individual_score_round(df):
    """"
    Plots scores of individual players over the course of the game
    Input: Dataframe
    Output: Plots of individual scores over time
    """
    #player1_score =  []
    #player2_score = []
    #turn = range(0,30)
    # for i in range(0,len(df[df.columns[1]])):
    #    #player1 Score over time
    #    player1_score.append(df[df.columns[3]][i])
    #    player2_score.append(df[df.columns[4]][i])

    plt.figure(figsize=(16, 10), dpi=80)
    plt.plot(df[df.columns[1]], df[df.columns[5]],
             label='player1', color='#003f5c')
    plt.plot(df[df.columns[1]], df[df.columns[6]],
             label='player2', color='#ffa600')
    plt.legend()
    plt.ylabel('Score')
    plt.xlabel('Game Turn (not individual)')
    plt.savefig("score_over_game_time.png")


# In[89]


def individual_score_time(df):

    player1_score = []
    player2_score = []

    for i in range(0, len(df[df.columns[1]])-1):
        if (i % 2 == 0):
            player1_score.append(df[df.columns[5]][i])
        else:
            player2_score.append(df[df.columns[6]][i])

    plt.figure(figsize=(16, 10), dpi=80)
    plt.plot(range(1, len(player1_score)+1), player1_score,
             label='player1', color='#003f5c')
    plt.plot(range(1, len(player2_score)+1), player2_score,
             label='player2', color='#ffa600')

    plt.legend()
    plt.ylabel('Score')
    plt.xlabel("Player's Turn")
    plt.savefig("score.png")


# In[229]:


def individual_score_growth_turn(df):
    """"
    Plots scores of individual scores per individuals turn. Subtract current score by score in the previous turn
    Input: Dataframe
    Output: Plots of individual scores over time
    """

    player1_score = []
    player2_score = []

    for i in range(0, len(df[df.columns[1]])-1):
        if (i % 2 == 0):
            player1_score.append(df[df.columns[5]][i])
        else:
            player2_score.append(df[df.columns[6]][i])

    player1_score = difference(player1_score)
    player2_score = difference(player2_score)

    plt.figure(figsize=(16, 10), dpi=80)
    plt.plot(range(1, len(player1_score)+1), player1_score,
             label='player1', color='#003f5c')
    plt.plot(range(1, len(player2_score)+1), player2_score,
             label='player2', color='#ffa600')

    plt.legend()
    plt.ylabel('Score Growth')
    plt.xlabel("Player's Turn")
    plt.savefig("score_growth.png")


# In[230]:


def individual_turns(df):
    """"
    Plots who got a turn over time
    Input: Dataframe
    Output: Plots of individual turns over time
    """
    plt.figure(figsize=(16, 10), dpi=80)

    plt.plot(df[df.columns[1]], df[df.columns[7]],
             label='player1', color='#003f5c')
    plt.plot(df[df.columns[1]], df[df.columns[8]],
             label='player2', color='#ffa600')
    plt.legend()
    plt.ylabel('Turns')


# In[231]:


def individual_turns_pie_chart(df):
    val = [df[df.columns[7]][29], df[df.columns[8]][29]]
    fig = go.Figure(data=[go.Pie(values=val, hole=.3)])

    fig.update_layout(
        title_text="Player Turns",
        # Add annotations in the center of the donut pies.
        annotations=[dict(text='Player 2', x=0.18, y=0.5, font_size=20, showarrow=False),
                     dict(text='Player 1', x=0.82, y=0.5, font_size=20, showarrow=False)])

    fig.show()


# In[232]:


def individual_turns_time(df):
    """"
    Plots who got a turn over turns
    Input: Dataframe
    Output: Plots of individual turns over time

    """
    # place first row inside list of scores
    player1_turn = [df[df.columns[7]][0]]
    player2_turn = [df[df.columns[8]][0]]
    turn = range(0, 30)
    for i in range(0, len(df[df.columns[1]])-1):
        # player1 Score difference between t+1 and t
        player1_turn.append(df[df.columns[7]][i+1] - df[df.columns[8]][i])
        player2_turn.append(df[df.columns[7]][i+1] - df[df.columns[8]][i])

    plt.figure(figsize=(16, 10), dpi=80)
    # sns.regplot(player1_turn,player2_turn,y_jitter=.03,logistic=True)
    plt.scatter(df[df.columns[1]], player1_turn,
                label='player1', color='#003f5c')
    plt.scatter(df[df.columns[1]], player2_turn,
                label='player2', color='#ffa600')
    plt.legend()
    plt.ylabel('Turn')


#   In[345]


def time_per_turn(df):
    """
    Plots the time each player takes per turn

    """
    player1_time = []
    player2_time = []

    for i in range(0, len(df[df.columns[1]])-1):
        if (i % 2 == 0):
            player1_time.append(df[df.columns[4]][i])
        else:
            player2_time.append(df[df.columns[4]][i])

    plt.figure(figsize=(16, 10), dpi=80)
    plt.plot(range(1, len(player1_time)+1), player1_time,
             label='player1', color='#003f5c')
    plt.plot(range(1, len(player2_time)+1), player2_time,
             label='player2', color='#ffa600')

    plt.legend()
    plt.ylabel('Time')
    plt.xlabel('Turns')
    plt.savefig("time.png")

# In[66]


def repositions_per_turn(df):
    """
    Plots the positional movements (rotate, left, right) each player makes per turn

    """
    player1_drops = []
    player2_drops = []

    for i in range(0, len(df[df.columns[1]])-1):
        if (i % 2 == 0):
            player1_drops.append(
                df[df.columns[9]][i+1] + df[df.columns[10]][i] + df[df.columns[13]][i+1])
        else:
            player2_drops.append(
                df[df.columns[14]][i+1] + df[df.columns[15]][i] + df[df.columns[18]][i+1])

    player1_drops = difference(player1_drops)
    player2_drops = difference(player2_drops)

    plt.figure(figsize=(16, 10), dpi=80)
    plt.plot(range(1, len(player1_drops)+1), player1_drops,
             label='player1', color='#003f5c')
    plt.plot(range(1, len(player2_drops)+1), player2_drops,
             label='player2', color='#ffa600')
    plt.legend()
    plt.ylabel('repositions (left, right, rotate)')
    plt.xlabel('Turns')
    plt.savefig("repositions.png")


# In[56]


def hard_drops_per_turn(df):
    """
    Plots the harddrops each player makes per turn

    """
    player1_drops = []
    player2_drops = []

    for i in range(0, len(df[df.columns[1]])-1):
        if (i % 2 == 0):
            player1_drops.append(df[df.columns[12]][i])
        else:
            player2_drops.append(df[df.columns[17]][i])

    player1_drops = difference(player1_drops)
    player2_drops = difference(player2_drops)

    plt.figure(figsize=(16, 10), dpi=80)
    plt.plot(range(1, len(player1_drops)+1), player1_drops,
             label='player1', color='#003f5c')
    plt.plot(range(1, len(player2_drops)+1), player2_drops,
             label='player2', color='#ffa600')
    plt.legend()
    plt.ylabel('Drops')
    plt.xlabel('Turns')
    plt.savefig("hard_drops.png")


# In[236]:


def individual_average_score(df):
    """"
    Plots boxplot of each players performance
    Input: Dataframe
    Output: Boxplot of performance

    """
    players = ['player1', 'player2']
    player1_score = [df[df.columns[5]][0]]
    player2_score = [df[df.columns[6]][0]]
    turn = range(0, 30)
    for i in range(0, len(df[df.columns[1]])-1):
        # player1 Score difference between t+1 and t
        player1_score.append(df[df.columns[5]][i+1] - df[df.columns[5]][i])
        player2_score.append(df[df.columns[6]][i+1] - df[df.columns[6]][i])

    #px.box(df, x="player1", y=player1_score)


# In[237]:
# Plot
# Individual Cumulative Score over time
individual_score_time(df)

individual_score_round(df)

# #Individual Score per Turn
individual_score_growth_turn(df)

# #Individual  Turn
# individual_turns(df)

# #Individual  Turn-Pie Chart
# individual_turns_pie_chart(df)

# #Individual Turns over Time
# individual_turns_time(df)

time_per_turn(df)

hard_drops_per_turn(df)

repositions_per_turn(df)

# #boxplot- Individual Average Score
# individual_average_score(df)
plt.show()


# In[ ]:


# In[225]:


""""
players = ['player1', 'player2'] 
player1_score =  [df[df.columns[3]][0]]
player2_score = [df[df.columns[4]][0]]
turn = range(0,30)
for i in range(0,len(df[df.columns[1]])-1):
    #player1 Score difference between t+1 and t
    player1_score.append(df[df.columns[3]][i+1]- df[df.columns[3]][i])
    player2_score.append(df[df.columns[4]][i+1]- df[df.columns[4]][i])


data = {'Player1':player1_score, 'Player2':player2_score} 
newdf = pd.DataFrame(data) 
fig = make_subplots(rows=1, cols=2)

#newdf= pd.DataFrame(players,player1_score,player2_score)
newdf
fig.add_trace( sns.violinplot(newdf['Player1']))

fig.add_trace( sns.violinplot(newdf['Player2']))
fig.update_layout(height=600, width=800, title_text="Subplots")
fig.show()

"""


# In[ ]:

# In[ ]:


# In[ ]:


# In[ ]:


# In[58]:
