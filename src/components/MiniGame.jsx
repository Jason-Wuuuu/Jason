import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Box, Typography, Link, Fade } from "@mui/material";
import confetti from "canvas-confetti";

const MiniGame = memo(({ onClose, memojiRef, onHighScoreUpdate }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const modalRef = useRef(null);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(5);
    setCountdown(3);
  }, []);

  useEffect(() => {
    let timer;
    if (countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        setIsPlaying(true);
        setShake(true);
        setCountdown(null);
      }
    } else if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
      setShake(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isPlaying, timeLeft]);

  useEffect(() => {
    const memojiRect = memojiRef.current?.getBoundingClientRect();
    const modalElement = modalRef.current;

    if (memojiRect && modalElement) {
      modalElement.style.left = `${memojiRect.right + 20}px`;
      modalElement.style.top = `${memojiRect.top}px`;
    }
  }, [memojiRef]);

  useEffect(() => {
    const handleClick = () => {
      if (isPlaying) {
        setScore((prevScore) => prevScore + 1);
      } else if (timeLeft === 5 && countdown === null) {
        startGame();
      }
    };

    const memojiElement = memojiRef.current;
    if (memojiElement) {
      memojiElement.addEventListener("click", handleClick);
      memojiElement.style.animation =
        isPlaying || (timeLeft === 5 && countdown === null)
          ? "pulse 1s infinite"
          : "none";
      memojiElement.style.transformOrigin = "center";
    }
    return () => {
      if (memojiElement) {
        memojiElement.removeEventListener("click", handleClick);
        memojiElement.style.animation = "none";
      }
    };
  }, [memojiRef, isPlaying, timeLeft, startGame, countdown]);

  const triggerConfetti = useCallback(() => {
    confetti({
      zIndex: 9000,
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
      onHighScoreUpdate(score);
      triggerConfetti();
    }
  }, [score, highScore, triggerConfetti, onHighScoreUpdate]);

  useEffect(() => {
    if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, endGame]);

  const getEncouragingMessage = () => {
    if (score === 0) return "Keep on clicking! 🫵";
    if (score < 5) return "Not bad, keep going! 👍";
    if (score < 10) return "You're on fire! 🔥";
    return "Wow, you're a clicking machine! 🚀";
  };

  return (
    <Box
      ref={modalRef}
      sx={{
        position: "fixed",
        bgcolor: "#1E1E1E",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        width: 400,
        height: 250,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        zIndex: (theme) => theme.zIndex.modal + 1,
        animation: shake
          ? "shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite"
          : "none",
        "@keyframes shake": {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-4px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(4px, 0, 0)" },
        },
      }}
    >
      <Typography
        variant="h5"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{ textDecoration: "underline" }}
      >
        Memoji Clicker!
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {countdown !== null ? (
          <Typography variant="h2" align="center" fontWeight="bold">
            {countdown}
          </Typography>
        ) : (
          <Box
            display="flex"
            width="100%"
            flexDirection="column"
            alignItems="center"
          >
            {isPlaying ? (
              <>
                <Typography variant="body1" fontWeight="bold">
                  Time left: {timeLeft}s
                </Typography>
                <Typography variant="body1" mt={1} fontWeight="bold">
                  Score: {score}
                </Typography>
                <Fade in={true} timeout={1000}>
                  <Typography
                    variant="body1"
                    mt={2}
                    color="coral"
                    fontWeight="bold"
                  >
                    {getEncouragingMessage()}
                  </Typography>
                </Fade>
              </>
            ) : (
              <Box width="100%">
                {timeLeft === 0 ? (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <Typography
                      variant="body1"
                      color="gold"
                      fontWeight="bold"
                      sx={
                        score > highScore
                          ? {
                              animation: "pulse 1s infinite",
                              "@keyframes pulse": {
                                "0%": { transform: "scale(1)" },
                                "50%": { transform: "scale(1.05)" },
                                "100%": { transform: "scale(1)" },
                              },
                            }
                          : {}
                      }
                    >
                      {score > highScore && "🎉 New "}High Score: {highScore}
                    </Typography>

                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Final Score: {score}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="lightgray"
                      sx={{
                        animation: "pulse 1s infinite",
                        "@keyframes pulse": {
                          "0%": { transform: "scale(1)" },
                          "50%": { transform: "scale(1.05)" },
                          "100%": { transform: "scale(1)" },
                        },
                      }}
                    >
                      ← Click to start!
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        {isPlaying ? (
          <Typography variant="body2" color="lightgray">
            ← Keep clicking!
          </Typography>
        ) : timeLeft === 0 ? (
          <Link
            component="button"
            variant="body1"
            onClick={startGame}
            sx={{
              fontWeight: "bold",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            Restart! 🔄
          </Link>
        ) : null}
        <Box flexGrow={1} />
        <Link
          component="button"
          variant="body1"
          onClick={onClose}
          color="error"
          sx={{
            fontWeight: "bold",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          Close ❌
        </Link>
      </Box>
    </Box>
  );
});

export default MiniGame;
