from abc import ABC, abstractmethod

class BaseRule(ABC):
    @abstractmethod
    def evaluate(self, transaction, customer):
        """
        Returns True if rule is triggered.
        """
        pass

    @property
    @abstractmethod
    def name(self):
        pass

    @property
    @abstractmethod
    def message(self):
        pass

    @property
    @abstractmethod
    def risk_score_increment(self):
        pass